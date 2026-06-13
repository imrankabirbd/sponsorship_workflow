using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sponsorship.Application.DTOs
{
    public class ApprovalDto
    {
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public string Remarks { get; set; } = string.Empty;
    }
}
