import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { QrCode, BarChart3, Shield } from "lucide-react";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in">
            Smart Attendance Monitoring
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Automated, secure, and intelligent attendance tracking for modern educational institutions
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center mb-16 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <Button 
              size="lg" 
              onClick={() => navigate('/teacher')}
              className="bg-card text-card-foreground hover:bg-card/90 shadow-lg"
            >
              Teacher Portal
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/student')}
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Student Portal
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate('/analytics')}
              className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
            >
              Analytics
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-card/10 backdrop-blur-sm p-6 rounded-lg border border-primary-foreground/20 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <QrCode className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-primary-foreground">Dynamic QR Codes</h3>
              <p className="text-primary-foreground/80">Generate secure, time-limited QR codes for each class session</p>
            </div>
            
            <div className="bg-card/10 backdrop-blur-sm p-6 rounded-lg border border-primary-foreground/20 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Shield className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-primary-foreground">Anti-Proxy Protection</h3>
              <p className="text-primary-foreground/80">Multi-layer verification using GPS, WiFi, and device ID</p>
            </div>
            
            <div className="bg-card/10 backdrop-blur-sm p-6 rounded-lg border border-primary-foreground/20 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-primary-foreground">Real-time Analytics</h3>
              <p className="text-primary-foreground/80">Comprehensive dashboards with attendance trends and insights</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
};

export default Hero;
