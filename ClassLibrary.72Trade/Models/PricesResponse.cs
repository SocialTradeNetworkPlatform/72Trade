using OandaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OandaApi.Communications
{
    class PricesResponse
    {
        public long time { get; set; }
        public List<Price> prices { get; set; }
    }
}
