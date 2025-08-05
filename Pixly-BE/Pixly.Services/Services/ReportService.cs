using MapsterMapper;
using Microsoft.EntityFrameworkCore;
using Pixly.Models.InsertRequest;
using Pixly.Models.SearchRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Helper;
using Pixly.Services.Interfaces;

namespace Pixly.Services.Services
{
    public class ReportService : CRUDService<Models.DTOs.Report, Models.DTOs.Report, ReportSearchRequest, ReportInsertRequest, ReportUpdateRequest, Database.Report, int>, IReportService
    {
        public ReportService(IMapper mapper, ApplicationDbContext context, ICacheService cacheService) : base(mapper, context, cacheService)
        {
        }

        public override async Task<PagedList<Models.DTOs.Report>> GetPaged(ReportSearchRequest search)
        {
            var query = _context.Set<Database.Report>().AsQueryable();
            query = await AddFilter(query, search);
            var modelQuery = query.Select(x => Mapper.Map<Models.DTOs.Report>(x));
            var result = await PagedList<Models.DTOs.Report>.CreateAsync(
                    modelQuery, search.PageNumber, search.PageSize);
            return await AddTransformation(result, search);
        }

        protected Task<PagedList<Models.DTOs.Report>> AddTransformation(PagedList<Models.DTOs.Report> result, ReportSearchRequest search)
        {
            TransformEntitiesToAdmin(result);
            return Task.FromResult(result);
        }

        private void TransformEntitiesToAdmin(PagedList<Models.DTOs.Report> list)
        {
            foreach (var entity in list)
            {
                string transformation = entity.Photo.Orientation.ToLower() switch
                {
                    "portrait" => "c_fill,w_200,h_300,f_auto,q_100,dpr_auto,fl_progressive",
                    "square" => "c_fill,w_250,h_250,f_auto,q_100,dpr_auto,fl_progressive",
                    "landscape" => "c_fill,w_300,h_200,f_auto,q_100,dpr_auto,fl_progressive",
                    _ => "c_fill,w_250,h_250,f_auto,q_80,dpr_auto,fl_progressive"
                };

                entity.Photo.Url = TransformUrl(entity.Photo.Url, transformation);
            }
        }

        private string TransformUrl(string url, string transformation)
        {
            if (string.IsNullOrEmpty(url))
                return url;

            int uploadIndex = url.IndexOf("upload/");
            if (uploadIndex == -1) return url;

            return url.Substring(0, uploadIndex + 7) + transformation + "/" + url.Substring(uploadIndex + 7);
        }


        protected override async Task<IQueryable<Database.Report>> AddFilter(IQueryable<Database.Report> query, ReportSearchRequest? search)
        {
            if (!string.IsNullOrWhiteSpace(search?.ReportTitle))
            {
                query = query.Where(report => report.ReportTitle.ToLower().Contains(search.ReportTitle.ToLower())
                                    || report.ReportMessage.ToLower().Contains(search.ReportTitle.ToLower()));
            }

            if (search?.IsReportedUserIncluded == true)
            {
                query = query.Include(report => report.ReportedUser);
            }

            if (search?.IsReportedByUserIncluded == true)
            {
                query = query.Include(report => report.ReportedByUser);
            }

            if (search?.IsPhotoIncluded == true)
            {
                query = query.Include(report => report.Photo);
            }

            if (search.IsReportTypeIncluded == true)
            {
                query = query.Include(report => report.ReportType);
            }

            query = query.Where(report => report.Status.ReportStatusName == "Pending");

            return query;
        }

        protected override async Task BeforeInsert(Database.Report entity, ReportInsertRequest request)
        {
            entity.CreatedAt = DateTime.Now;

            var reportedByUser = await _context.Users.FindAsync(request.ReportedByUserId);
            if (reportedByUser == null) throw new NotFoundException($"User with ID {request.ReportedByUserId} not found");

            var reportedUser = await _context.Users.FindAsync(request.ReportedUserId);
            if (reportedUser == null) throw new NotFoundException($"User with ID {request.ReportedUserId} not found");

            var photo = await _context.Photos.FindAsync(request.PhotoId);
            if (photo == null) throw new NotFoundException($"Photo with ID {request.PhotoId} not found");

            var reportType = await _context.ReportTypes.FindAsync(request.ReportTypeId);
            if (reportType == null) throw new NotFoundException($"Report type with ID {request.PhotoId} not found");

            entity.ReportedByUser = reportedByUser;
            entity.ReportedUser = reportedUser;
            entity.ReportType = reportType;
            entity.Photo = photo;
        }

        protected override async Task BeforeUpdate(ReportUpdateRequest? request, Report? entity)
        {
            var admin = await _context.Users.FindAsync(request.AdminUserId);
            var reportStatus = await _context.ReportStatuses.FindAsync(request.ReportStatusId);

            entity.AdminUser = admin;
            entity.Status = reportStatus;
            entity.ResolvedAt = request.ResolvedAt;

            if (request.IsDeleted != null) entity.IsDeleted = entity.IsDeleted;
            if (!string.IsNullOrWhiteSpace(request?.AdminNotes)) entity.AdminNotes = request.AdminNotes;
        }

    }
}
