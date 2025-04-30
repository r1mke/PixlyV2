# Pixly Backend

## 🚀 New in this version

The new version of the Pixly backend brings significant improvements in architecture, performance, and code maintainability:

- **Modular design** - The architecture is divided into three key projects (API, Services, Models) enabling better organization and maintainability
- **Generic CRUD** - We've implemented generic controllers and services that significantly reduce code duplication
- **Consistent API responses** - We've standardized all API responses through the ApiResponse<T> pattern
- **Intelligent image handling** - Enhanced integration with Cloudinary for optimal display of images of different orientations and sizes
- **Advanced filtering and sorting** - More flexible system for searching, filtering, and sorting photo collections

## 🏗️ Project architecture

The project is structured into three main components:

### Pixly.API
The frontend for our application containing controllers and API endpoints. This layer is responsible for receiving HTTP requests, validating input data, and formatting responses.

### Pixly.Services
The middle layer that implements the business logic of the application. It contains services, database interaction, and integration with external services like Cloudinary.

### Pixly.Models
Contains data models, DTOs, and search requests. This project is shared between the API and Services layers and defines the structure of data being exchanged.

## 🔧 Technologies

- **.NET 8** - The latest .NET framework with support for the newest C# features
- **Entity Framework Core 8** - ORM for database interaction
- **Mapster** - Fast object mapping library
- **Cloudinary** - Service for managing and optimizing images
- **SQL Server** - Relational database
- **Docker** - Containerization for easy deployment and scaling


## 📋 API features

- **Photos**: Upload, view, update, and delete photos
- **Search**: Advanced search by name, tags, orientation, and size
- **Likes**: Ability to mark photos you like
- **Users**: User account management
- **Tags**: Organize photos using tags

## 💡 Benefits of the new design

### For developers
- **Less code repetition** - Generic CRUD reduces the amount of code needed for standard operations
- **Easier maintenance** - Clear separation of responsibilities makes finding and fixing bugs easier
- **Simple extension** - Adding new entities and APIs requires minimal effort

### For end users
- **Faster image loading** - Optimized images depending on device and display context
- **More flexible search** - More options for filtering and sorting content
- **Consistent responses** - Standardized response format facilitates integration with frontend applications

## 🛣️ Roadmap

The following improvements are planned:

- **Authentication and authorization** - Implementation of JWT authentication
- **Real-time notifications** - Using SignalR for instant notifications about new photos and activities
- **Comments** - Ability to comment on photos
- **Statistics** - Advanced analytics for users and their photos
- **E-commerce integration** - Ability to buy and sell photos


## 📝 License

This project is licensed under the [MIT license](LICENSE).


