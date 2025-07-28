import { useEffect, useState } from "react";
import type { ReactElement } from "react";

interface SideProject {
  notes?: string;
  dates: string;
  name: string;
  members: string[];
  id?: string;
}

export default function SideProjects(): ReactElement {
  const [sideProjects, setSideProjects] = useState<SideProject[]>([]);

  useEffect(() => {
    const fetchSideProjects = async () => {
      try {
        const response = await fetch("/api/side-projects");
        if (response.ok) {
          const data = await response.json();
          setSideProjects(data);
        }
      } catch (error) {
        console.error("Error fetching side projects:", error);
      }
    };
    fetchSideProjects();
  }, []);

  return (
    <div className="p-4 md:p-6">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-content-text-primary">Side Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sideProjects.map((project) => (
            <div key={project.id || project.name} className="h-full">
              <div className="card-premium rounded-lg p-6 h-full">
                <h3 className="text-xl font-bold text-content-text-primary mb-2">{project.name}</h3>
                <div className="text-content-text-tertiary mb-4">
                  {project.dates.split(",").map((item) => (
                    <span key={item} className="mr-2">
                      {item.trim()}
                    </span>
                  ))}
                </div>
                <div className="text-content-text-secondary">
                  {project.members.map((member) => (
                    <div key={member} className="mb-1">
                      {member}
                    </div>
                  ))}
                </div>
                {project.notes && <div className="mt-4 text-content-text-secondary text-sm">{project.notes}</div>}
              </div>
            </div>
          ))}
        </div>

        {sideProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-content-text-secondary">Loading side projects...</p>
          </div>
        )}
      </div>
    </div>
  );
}
