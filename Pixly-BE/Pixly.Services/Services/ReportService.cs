using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class ReportService : CRUDService<Models.DTOs.Report, Models.DTOs.Report, ReportSearchRequest, ReportInsertRequest, ReportUpdateRequest, Database.Report, int>, IReportService
    {
        public ReportService(IMapper mapper, ApplicationDbContext context, ICacheService cacheService) : base(mapper, context, cacheService)
        {
        }

        protected override async Task<IQueryable<Report>> AddFilter(IQueryable<Report> query, ReportSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.ReportTitle))
            {
                query = query.Where(report => report.ReportTitle.ToLower().Contains(search.ReportTitle.ToLower())
                                    || report.ReportMessage.ToLower().Contains(search.ReportTitle.ToLower()));
            }

            if (search?.IsUserIncluded == true)
            {
                query = query.Include(report => report.User);
            }

            if (search?.IsUserIncluded == true)
            {
                query = query.Include(report => report.Photo);
            }

            return query;
        }

        protected override async Task BeforeInsert(Report entity, ReportInsertRequest request)
        {
            entity.CreatedAt = DateTime.Now;

            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) throw new NotFoundException($"User with ID {request.UserId} not found");

            var photo = await _context.Photos.FindAsync(request.PhotoId);
            if (photo == null) throw new NotFoundException($"Photo with ID {request.PhotoId} not found");

            entity.User = user;
            entity.Photo = photo;
        }

    }
}
