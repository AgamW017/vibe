import { Outlet, Link } from "@tanstack/react-router";
import { useAuthStore } from "@/lib/store/auth-store";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import FloatingVideo from "@/components/floating-video";

export default function StudentLayout() {
  const { user } = useAuthStore();
  // console.log('Current user role:', user?.role);


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      {/* <FloatingVideo isVisible={user?.role === 'student'}></FloatingVideo> */}
      
      {/* Ambient background effect */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-secondary/[0.02] pointer-events-none" />
      
      <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b border-border/20 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-300 before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-primary/[0.02] before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-500">
        <div className="flex w-full items-center justify-between px-8 relative z-10">
          <div className="relative z-20 flex items-center text-xl font-bold tracking-tight group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="relative p-1">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" />
                <img
                  src="https://www.iitrpr.ac.in/iitrpr-conclave/images/iitrpr_white.png"
                  alt="IIT Ropar Logo"
                  className="relative h-8 w-8 object-contain bg-white rounded"
                  style={{ background: 'white' }}
                />
              </div>
              <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent drop-shadow-sm transition-all duration-300 group-hover:from-primary group-hover:to-primary/80">
                Vibe
              </span>
            </div>
          </div>
          {/* <div className="flex items-center gap-4">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem>
                      {item.isCurrentPage ? (
                        <BreadcrumbPage>{item.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={item.path} asChild>
                          <Link to={item.path}>{item.label}</Link>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div> */}
          
          
          <div className="flex items-center gap-8">
            {/* Navigation Menu */}
            <nav className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="relative h-10 px-4 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/30 hover:to-accent/10 hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 data-[state=active]:text-primary before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                asChild
              >
                <Link to="/student">
                  <span className="relative z-10">Dashboard</span>
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="relative h-10 px-4 text-sm font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-accent/30 hover:to-accent/10 hover:text-accent-foreground hover:shadow-lg hover:shadow-accent/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/10 data-[state=active]:to-primary/5 data-[state=active]:text-primary before:absolute before:inset-0 before:rounded-md before:bg-gradient-to-r before:from-primary/5 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300"
                asChild
              >
                <Link to="/student/courses">
                  <span className="relative z-10">Courses</span>
                </Link>
              </Button>
            </nav>
            
            {/* <div className="h-6 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" /> */}
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <ThemeToggle />
              </div>
              
              <Link to="/student/profile" className="group relative">
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110 blur-sm" />
                <Avatar className="relative h-9 w-9 cursor-pointer border-2 border-transparent transition-all duration-300 group-hover:border-primary/20 group-hover:shadow-xl group-hover:shadow-primary/20 group-hover:scale-105">
                  <AvatarImage src={user?.avatar} alt={user?.name} className="transition-all duration-300" />
                  <AvatarFallback className="bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 text-primary font-bold text-sm transition-all duration-300 group-hover:from-primary/25 group-hover:to-primary/10">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="relative flex flex-1 flex-col p-6">
        {/* Content background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background pointer-events-none" />
        <div className="relative z-10 h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
