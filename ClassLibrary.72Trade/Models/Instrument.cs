using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OandaApi.Models
{
    public class Instrument
    {
        public string instrument;
        public string displayName { get; set; }
        public string pip;
        public int pipLocation;
        public int extraPrecision;
    }
}
