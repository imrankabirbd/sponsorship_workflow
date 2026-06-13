using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Domain
{
    public enum RequestStatus
    {
        Draft = 1,
        PendingManager = 2,
        PendingFinance = 3,
        Approved = 4,
        Rejected = 5,
        Cancelled = 6
    }
}
