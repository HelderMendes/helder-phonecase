import { db } from '@/db';
import { notFound } from 'next/navigation';
import DesignConfigurator from './DesignConfigurator';

interface DesignPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const DesignPage = async ({ searchParams }: DesignPageProps) => {
  const { id } = searchParams;
  if (!id || typeof id !== 'string') return notFound();
  // if (!id || Array.isArray(id)) return notFound();

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  if (!configuration) return notFound();

  const { imageUrl, width, height } = configuration;

  return (
    <>
      <h3>{id}</h3>
      <DesignConfigurator
        configId={configuration.id}
        imageDimensions={{ width, height }}
        imageUrl={imageUrl}
      />
    </>
  );
};

export default DesignPage;
