import React from "react";
import { Link } from "react-router";
import {
  Calendar,
  User,
  ExternalLink,
  Github,
  Play,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  project: {
    id: number;
    title: string;
    type: string;
    topic: string;
    year: string;
    supervisor: string;
    students: string[];
    abstract: string;
    technologies: string[];
    status: string;
    startDate: string;
    expectedCompletion: string;
    demoLink?: string;
    githubLink?: string;
    publications: string[];
    funding: string;
  };
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const getTypeColor = (type: string) => {
    return type === "faculty"
      ? "bg-purple-100 text-purple-800"
      : "bg-blue-100 text-blue-800";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "ongoing":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTopicColor = (topic: string) => {
    const colors = {
      "artificial-intelligence": "bg-red-100 text-red-800",
      "web-development": "bg-green-100 text-green-800",
      "mobile-development": "bg-blue-100 text-blue-800",
      "data-science": "bg-purple-100 text-purple-800",
      iot: "bg-orange-100 text-orange-800",
      cybersecurity: "bg-red-100 text-red-800",
    };
    return colors[topic as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-primary-dark mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className={getTypeColor(project.type)}>
                    {project.type === "faculty"
                      ? "FACULTY RESEARCH"
                      : "STUDENT PROJECT"}
                  </Badge>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status.toUpperCase()}
                  </Badge>
                  <Badge className={getTopicColor(project.topic)}>
                    {project.topic.replace("-", " ").toUpperCase()}
                  </Badge>
                  <Badge variant="secondary">{project.year}</Badge>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center space-x-2 mb-2">
                <User className="w-4 h-4 text-primary-yellow" />
                <span className="text-sm font-bold text-primary-dark">
                  Supervisor: {project.supervisor}
                </span>
              </div>
              <div className="flex items-start space-x-2 mb-3">
                <User className="w-4 h-4 text-primary-yellow mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-primary-dark">
                    Team Members:{" "}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {project.students.join(", ")}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-text-secondary mb-4 leading-relaxed">
              {project.abstract}
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Technologies
                </h4>
                <div className="flex flex-wrap gap-1">
                  {project.technologies.map((tech, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Project Timeline
                </h4>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-primary-yellow" />
                    <span className="text-text-secondary">
                      Started:{" "}
                      {new Date(project.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-3 h-3 text-primary-yellow" />
                    <span className="text-text-secondary">
                      {project.status === "completed"
                        ? "Completed"
                        : "Expected"}
                      :{" "}
                      {new Date(
                        project.expectedCompletion
                      ).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {project.publications.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Publications
                </h4>
                <ul className="space-y-1">
                  {project.publications.map((publication, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Award className="w-3 h-3 text-primary-yellow mt-1 flex-shrink-0" />
                      <span className="text-sm text-text-secondary">
                        {publication}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                Funding
              </h4>
              <p className="text-sm text-green-600 font-bold">
                {project.funding}
              </p>
            </div>
          </div>

          {/* Actions and Links */}
          <div className="space-y-4">
            <div>
              <h4 className="font-bold text-sm uppercase text-primary-dark mb-3">
                Project Links
              </h4>
              <div className="space-y-2">
                {project.demoLink && (
                  <Button size="sm" className="w-full">
                    <Play className="w-3 h-3 mr-1" />
                    VIEW DEMO
                  </Button>
                )}

                {project.githubLink && (
                  <Button size="sm" variant="outline" className="w-full">
                    <Github className="w-3 h-3 mr-1" />
                    SOURCE CODE
                  </Button>
                )}

                <Link to={`/projects/${project.id}`}>
                  <Button size="sm" variant="outline" className="w-full">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    PROJECT DETAILS
                  </Button>
                </Link>
              </div>
            </div>

            {project.status === "ongoing" && (
              <div className="bg-blue-50 p-4 rounded border">
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Project Status
                </h4>
                <p className="text-sm text-text-secondary mb-2">
                  This project is currently in progress.
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: "65%" }}></div>
                </div>
                <p className="text-xs text-text-secondary mt-1">
                  Estimated 65% complete
                </p>
              </div>
            )}

            {project.status === "completed" && (
              <div className="bg-green-50 p-4 rounded border">
                <h4 className="font-bold text-sm uppercase text-primary-dark mb-2">
                  Project Completed
                </h4>
                <p className="text-sm text-text-secondary">
                  This project has been successfully completed and is available
                  for review.
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectCard;
