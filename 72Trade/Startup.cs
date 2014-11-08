using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(_72Trade.Startup))]
namespace _72Trade
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
