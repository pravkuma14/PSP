using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Pims.Dal.Entities;

namespace Pims.Dal.Repositories
{
    /// <summary>
    /// HistoricalNumberRepository class, provides a service layer to interact with property Historic Numbers within the datasource.
    /// </summary>
    public class HistoricalNumberRepository : BaseRepository<PimsFileNumber>, IHistoricalNumberRepository
    {
        #region Constructors

        /// <summary>
        /// Creates a new instance of a HistoricalNumberRepository, and initializes it with the specified arguments.
        /// </summary>
        /// <param name="dbContext"></param>
        /// <param name="user"></param>
        /// <param name="logger"></param>
        public HistoricalNumberRepository(PimsContext dbContext, ClaimsPrincipal user, ILogger<HistoricalNumberRepository> logger)
            : base(dbContext, user, logger)
        {
        }
        #endregion

        #region Methods

        /// <summary>
        /// Get all historical file numbers by property id.
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public IList<PimsFileNumber> GetAllByPropertyId(long propertyId)
        {
            var fileNumbers = Context.PimsFileNumbers.AsNoTracking()
                .Include(p => p.FileNumberTypeCodeNavigation)
                .Where(p => p.PropertyId == propertyId)
                .OrderBy(p => p.FileNumberTypeCodeNavigation.DisplayOrder)
                .ToList();
            return fileNumbers;
        }
        #endregion
    }
}