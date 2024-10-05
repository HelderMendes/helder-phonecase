'use server'; //Next specifications
import { db } from '@/db';
import {
  PhoneCaseColor,
  PhoneCaseModel,
  PhoneCaseMaterial,
  PhoneCaseFinish,
} from '@prisma/client';

export type SaveConfigArgs = {
  color: PhoneCaseColor;
  model: PhoneCaseModel;
  material: PhoneCaseMaterial;
  finish: PhoneCaseFinish;
  configId: string;
};

export async function saveConfig({
  color,
  model,
  material,
  finish,
  configId,
}: SaveConfigArgs) {
  await db.configuration.update({
    where: { id: configId },
    data: { color, model, material, finish },
  });
}
