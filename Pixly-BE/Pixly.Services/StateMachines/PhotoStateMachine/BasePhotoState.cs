﻿using MapsterMapper;
using Microsoft.Extensions.DependencyInjection;
using Pixly.Models.InsertRequest;
using Pixly.Models.UpdateRequest;
using Pixly.Services.Database;
using Pixly.Services.Exceptions;
using Pixly.Services.Interfaces;

namespace Pixly.Services.StateMachines.PhotoStateMachine
{
    public enum PhotoState
    {
        Initial,
        Draft,
        Pending,
        Approved,
        Hidden,
        Rejected,
        Deleted,
        Reported
    }
    public class BasePhotoState
    {
        protected readonly ICloudinaryService _cloudinary;
        public IMapper Mapper { get; set; }
        public IServiceProvider ServiceProvider { get; set; }

        protected readonly ApplicationDbContext _context;

        public BasePhotoState(IMapper mapper,
            IServiceProvider serviceProvider, ICloudinaryService cloudinary, ApplicationDbContext context)
        {
            Mapper = mapper;
            ServiceProvider = serviceProvider;
            _cloudinary = cloudinary;
            _context = context;
        }
        public virtual Task<Models.DTOs.Photo> Insert(PhotoInsertRequest request)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Update(int id, PhotoUpdateRequest request)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Submit(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Approve(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Reject(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Edit(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Hide(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Delete(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<Models.DTOs.Photo> Restore(int id)
        {
            throw new ForbiddenException("Method not allowed");
        }
        public virtual Task<List<string>> AllowedActions(Models.DTOs.Photo enitity)
        {
            throw new ForbiddenException("Method not allowed");
        }
        protected async Task<Database.Photo> SetState(int id, string state)
        {
            var entity = await _context.Photos.FindAsync(id);
            if (entity == null) throw new NotFoundException($"Photo with ID {id} not found");

            entity.State = state;
            return entity;
        }
        public BasePhotoState CreateState(string state)
        {
            switch (state)
            {
                case "Initial":
                    return ServiceProvider.GetService<InitialPhotoState>();
                case "Draft":
                    return ServiceProvider.GetService<DraftPhotoState>();
                case "Pending":
                    return ServiceProvider.GetService<PendingPhotoState>();
                case "Approved":
                    return ServiceProvider.GetService<ApprovedPhotoState>();
                case "Hidden":
                    return ServiceProvider.GetService<HiddenPhotoState>();
                case "Rejected":
                    return ServiceProvider.GetService<RejectedPhotoState>();
                case "Deleted":
                    return ServiceProvider.GetService<DeletedPhotoState>();
                case "Reported":
                    return ServiceProvider.GetService<ReportedPhotoState>();
                default: throw new Exception("State not recognized");
            }
        }
    }
}
