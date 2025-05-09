import { useEffect, useState } from "react";
import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "../components/Clock";
import Discord from "../components/Discord";
import DiscordActivity from "../components/DiscordActivity";
import GenericMeta from "../components/GenericMeta";
import Spotify from "../components/Spotify";
import Weather from "../components/Weather";
import { socials } from "../data/socials";
import { Icon } from '@iconify/react';

const birthday = new Date(1998, 8, 31);

export async function getStaticProps() {
  return {
    props: {
      age: differenceInCalendarYears(Date.now(), birthday).toString()
    }
  };
}

export default function Home({
  age
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <GenericMeta
        title="Stan's Portfolio"
        description=""
      />

      <h1 className="heading mb-2">
        Stan&nbsp;<Icon icon="material-symbols:verified" color="#1dcaff" width="40" />
      </h1>

      <p className="mb-4">
        <span className="opacity-80">Roblox Developer & Scripter.{" "}
        </span>
      </p>

      <p className="mb-2 flex flex-wrap gap-2 items-center">
        {socials.map(({ name, icon, url }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-6 h-6 hover:opacity-80 transition"
          >
            <Icon icon={icon} />
          </a>
        ))}
      </p>

      <p className="mb-4 text-base text-gray-500">
        {isClient && (
          <>
            <Clock />
            <Weather onlyCity={true} />
            <Weather />
          </>
        )}
      </p>

      <hr className="mb-4 bg-slate-800 border-none h-0.5" />

      {isClient && (
        <>
          <Discord />
          <DiscordActivity />
          <Spotify />
        </>
      )}
    </>
  );
}