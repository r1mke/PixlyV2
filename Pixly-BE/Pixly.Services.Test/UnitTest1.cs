using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using Pixly.Models.Request;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;
using Pixly.Services.Services;

namespace Pixly.Services.Tests
{
    public class UnitTest1
    {
        [Fact]
        public async Task RegisterAsync_Should_Return_User_And_Response()
        {
            // Arrange
            var userService = new Mock<IUserService>();
            var tokenService = new Mock<ITokenService>();
            var twoFactorService = new Mock<ITwoFactorService>();
            var emailService = new Mock<IEmailService>();
            var logger = new Mock<ILogger<IAuthService>>();

            var request = new RegisterRequest { Email = "test@pix.ly", Password = "1234" };
            var fakeUser = new User { Id = "1", Email = request.Email };

            userService.Setup(u => u.CreateUserAsync(request))
                       .ReturnsAsync(fakeUser);

            var sut = new AuthService(userService.Object, tokenService.Object, logger.Object, twoFactorService.Object, emailService.Object);

            // Act
            var (user, response) = await sut.RegisterAsync(request);

            // Assert
            user.Should().Be(fakeUser);
            response.Email.Should().Be("test@pix.ly");
        }

        [Fact]
        public async Task LoginAsync_WithInvalidCredentials_ShouldThrowUnauthorizedException()
        {
            // Arrange
            var userService = new Mock<IUserService>();
            var tokenService = new Mock<ITokenService>();
            var twoFactorService = new Mock<ITwoFactorService>();
            var emailService = new Mock<IEmailService>();
            var logger = new Mock<ILogger<IAuthService>>();

            var sut = new AuthService(userService.Object, tokenService.Object, logger.Object, twoFactorService.Object, emailService.Object);

            var request = new LoginRequest { Email = "wrong@pix.ly", Password = "badpass" };

            // simuliramo da userService kaže da kredencijali nisu dobri
            userService
                .Setup(u => u.VerifyCredentialsAsync(request.Email, request.Password))
                .ReturnsAsync((false, null!, false, false));

            // Act
            Func<Task> act = async () => await sut.LoginAsync(request);

            // Assert
            await act.Should().ThrowAsync<UnauthorizedException>()
                     .WithMessage("Invalid email or password.");

            userService.Verify(u => u.VerifyCredentialsAsync(request.Email, request.Password), Times.Once);
        }

        [Fact]
        public async Task LoginAsync_WhenRequires2FA_Should_Return_RequiresTwoFactor_And_SendCode()
        {
            // Arrange
            var userService = new Mock<IUserService>();
            var tokenService = new Mock<ITokenService>();
            var twoFactorService = new Mock<ITwoFactorService>();
            var emailService = new Mock<IEmailService>();
            var logger = new Mock<ILogger<IAuthService>>();

            var sut = new AuthService(userService.Object, tokenService.Object, logger.Object, twoFactorService.Object, emailService.Object);

            var request = new LoginRequest { Email = "2fa@pix.ly", Password = "ok" };
            var user = new User { Id = "u2", Email = request.Email, EmailConfirmed = true };

            userService
                .Setup(u => u.VerifyCredentialsAsync(request.Email, request.Password))
                .ReturnsAsync((true, user, true, user.EmailConfirmed));

            twoFactorService
                .Setup(t => t.GenerateTwoFactorCodeAsync(user.Id))
                .ReturnsAsync("123456");

            // Act
            var resp = await sut.LoginAsync(request, ipAddress: "1.2.3.4");

            // Assert
            resp.RequiresTwoFactor.Should().BeTrue();
            resp.RefreshToken.Should().BeEmpty();
            resp.EmailConfirmed.Should().BeTrue();

            twoFactorService.Verify(t => t.GenerateTwoFactorCodeAsync(user.Id), Times.Once);
            emailService.Verify(e => e.Queue2FACodeAsync(user.Email, "123456"), Times.Once);
        }

        [Fact]
        public async Task RefreshTokenAsync_WhenSecurityException_Should_Rethrow()
        {
            // Arrange
            var userService = new Mock<IUserService>();
            var tokenService = new Mock<ITokenService>();
            var twoFactorService = new Mock<ITwoFactorService>();
            var emailService = new Mock<IEmailService>();
            var logger = new Mock<ILogger<IAuthService>>();

            var sut = new AuthService(userService.Object, tokenService.Object, logger.Object, twoFactorService.Object, emailService.Object);

            var req = new RefreshTokenRequest { RefreshToken = "bad" };

            tokenService
                .Setup(t => t.ValidateRefreshTokenAsync(null, "bad", null))
                .ThrowsAsync(new System.Security.SecurityException("invalid"));

            // Act
            var act = () => sut.RefreshTokenAsync(req);

            // Assert
            await act.Should().ThrowAsync<System.Security.SecurityException>()
                     .WithMessage("*invalid*");

            tokenService.Verify(t => t.RotateRefreshTokenAsync(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

    }
}
