using OandaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OandaApi.Communications
{
    class OrdersResponse
    {
        public List<Order> orders { get; set; }
        public string nextPage { get; set; }
    }
}
