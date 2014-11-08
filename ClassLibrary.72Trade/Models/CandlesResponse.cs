using OandaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OandaApi.Communications
{
    class CandlesResponse
    {
        public string instrument  { get; set; }
        public string granularity  { get; set; }
        public List<Candle> candles { get; set; }
    }
}
