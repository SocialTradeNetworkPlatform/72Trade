﻿using OandaApi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace OandaApi.Communications
{
    public class TransactionsResponse
    {
        public List<Transaction> transactions;
        public string nextPage;
    }
}
