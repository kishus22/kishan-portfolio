import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS } from "@/data/projects";

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ id: String(project.id) }));
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = PROJECTS.find((item) => String(item.id) === id);

  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden px-6 pt-28 pb-16 md:pt-32 md:pb-20">
        <div className="absolute inset-0">
          <Image
            src={project.image}
            alt={project.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ filter: "brightness(0.5) contrast(1.1) saturate(0.7)" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(2,4,9,0.96)_35%,rgba(2,4,9,0.25)_100%)]" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <Link
            href="/#projects"
            className="label-cinematic inline-flex rounded border border-cyan-400/30 px-4 py-2 hover:border-cyan-300"
          >
            ← Back to Projects
          </Link>
          <p className="label-cinematic mt-8">{project.year}</p>
          <h1 className="h2-cinematic mt-3 text-white">{project.name}</h1>
          <p className="body-cinematic mt-4 max-w-3xl">{project.overview}</p>
        </div>
      </section>

      <section className="px-6 py-[60px] md:py-[100px]">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="glass-panel rounded-2xl p-8">
            <p className="label-cinematic">Overview</p>
            <p className="body-cinematic mt-3">{project.overview}</p>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <p className="label-cinematic">Problem</p>
            <p className="body-cinematic mt-3">{project.problem}</p>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <p className="label-cinematic">Solution architecture</p>
            <p className="body-cinematic mt-3">{project.solution}</p>
          </div>
          <div className="glass-panel rounded-2xl p-8">
            <p className="label-cinematic">Key Achievement</p>
            <p className="body-cinematic mt-3">{project.achievements[0]}</p>
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl overflow-hidden rounded-2xl border border-cyan-400/15">
          <div className="relative aspect-[21/9] min-h-[220px]">
            <Image
              src={project.image}
              alt={`${project.name} screenshot`}
              fill
              className="object-cover"
              style={{ filter: "brightness(0.55) contrast(1.05)" }}
            />
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl glass-panel rounded-2xl p-8">
          <p className="label-cinematic">Tech stack</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <span key={item} className="label-cinematic rounded border border-cyan-400/30 px-3 py-1">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-5xl glass-panel rounded-2xl p-8">
          <p className="label-cinematic">Achievements</p>
          <ul className="mt-4 space-y-3">
            {project.achievements.map((item) => (
              <li key={item} className="body-cinematic flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="label-cinematic rounded border border-cyan-400/40 px-4 py-3 hover:border-cyan-300"
            >
              GitHub Repository
            </a>
            {project.demo ? (
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                className="label-cinematic rounded border border-cyan-400/40 px-4 py-3 hover:border-cyan-300"
              >
                Live Demo
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
