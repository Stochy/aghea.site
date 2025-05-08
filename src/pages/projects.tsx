import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";

import GenericMeta from "../components/GenericMeta";
import { projects } from "../data/projects";

const skillIconsEndpoint = "https://skillicons.dev/icons?theme=dark&i=";

export default function Projects() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const toggleModal = (image?: string) => {
    setIsModalOpen(!isModalOpen);
    setModalImage(image || null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  return (
    <>
      <GenericMeta
        title="Projects"
        description="Some projects I've worked on."
      />

      <h1 className="heading mb-8">
        Projects{" "}
        <Icon
          icon="solar:programming-outline"
          className="ml-4 h-12 w-12 text-blue-400"
        />
      </h1>

      {projects.map(({ name, description, image, url, stack }) => (
        <div key={name} className="mb-4 flex flex-col rounded-lg bg-slate-900">
          <div className="relative">
            <div className="overflow-hidden h-24">
              <Image
                src={image}
                alt={name}
                width={1200}
                height={800}
                priority={true}
                className="absolute top-0 left-0 w-full h-full object-cover object-center rounded-t-lg transition duration-500 group-hover:scale-105 cursor-pointer"
                onClick={() => toggleModal(image)}
                onContextMenu={(e) => e.preventDefault()}
              />
            </div>

            <div className="flex absolute bottom-2 right-2 gap-2">
              {stack.map(({ name, icon, src }) => (
                <div
                  key={name}
                  className="w-6 h-6 md:w-10 md:h-10 rounded-[25%] bg-slate-900 relative group cursor-pointer flex justify-center"
                >
                  <Image
                    key={name}
                    src={icon !== undefined ? `${skillIconsEndpoint}${icon}` : src}
                    width={120}
                    height={120}
                    alt={name}
                    className="w-full h-full rounded-[25%] bg-[#242938]"
                    quality={100}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <div className="absolute mb-1 px-2 py-1 text-white text-sm bg-slate-900 opacity-0 group-hover:opacity-100 transition pointer-events-none bottom-full rounded-lg w-max">
                    {name}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-start">
              <div>
                <h2 className="text-white mb-2 font-heading font-extrabold text-2xl">
                  {name}
                </h2>
                <p className="text-white text-lg">{description}</p>
              </div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer noopener"
                title={`Visit ${name}`}
                className="ml-auto transition hover:opacity-80"
              >
                <Icon icon="line-md:external-link" className="text-white w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      ))}

      {isModalOpen && modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div
            className="relative rounded-lg"
            style={{
              width: "auto",
              height: "100%",
              overflow: "hidden",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={(e) => { e.stopPropagation(); closeModal(); }}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 z-10 text-white bg-red-500 rounded-full p-2 hover:bg-red-600 transition"
              aria-label="Close Modal"
            >
              <Icon icon="line-md:close" className="w-6 h-6" />
            </button>

            <img
              src={modalImage}
              alt="Modal Project Image"
              className="rounded-lg"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                margin: "auto",
              }}
              onClick={closeModal}
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>
        </div>
      )}
    </>
  );
}