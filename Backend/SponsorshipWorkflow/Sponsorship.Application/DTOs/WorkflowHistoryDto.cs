using Sponsorship.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application
{
    public class WorkflowHistoryDto
    {
        public int Id { get; set; }
        public int RequestId { get; set; }

        public string Action { get; set; } = "";

        public int ActorUserId { get; set; }

        public string Actor { get; set; } = "";

        public string? Remarks { get; set; }

        public RequestStatus OldStatus { get; set; }

        public RequestStatus NewStatus { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
