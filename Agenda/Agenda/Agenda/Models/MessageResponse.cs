using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Agenda.Models
{
    public class MessageResponse<T>
    {
        public T Response { get; set; }

        public Error Error { get; set; }

        public MessageResponse(T response)
        {
            this.Response = response;
            this.Error = new Error { IsError = false };
        }

        public MessageResponse(Error error)
        {
            this.Error = error;
        }
    }
}
