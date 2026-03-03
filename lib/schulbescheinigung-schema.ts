/**
 * Validierungsschema für XSchule Schulbescheinigung (1.2)
 * Orientierung an: https://xschule.digital/def/xschule/1.2/xml/XSchule_Schulbescheinigung_01.xml
 * Pflichtfelder und Datentypen gemäß XML-Struktur.
 */

import { z } from 'zod';

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Datum im Format JJJJ-MM-TT angeben')
  .refine((s) => !Number.isNaN(Date.parse(s)), 'Ungültiges Datum');

export const schulbescheinigungSchema = z.object({
  // Ausstellung
  ausstellungsdatum: dateSchema,
  ausstellungsort: z.string().min(1, 'Ort der Ausstellung ist Pflicht').trim(),

  // Gültigkeit
  gueltigkeitsdatum: dateSchema,

  // Schüler:in – natürliche Person
  familienname: z.string().min(1, 'Familienname ist Pflicht').trim(),
  vorname: z.string().min(1, 'Vorname ist Pflicht').trim(),

  // Geburt
  geburtsdatum: dateSchema,
  geburtsort: z.string().min(1, 'Geburtsort ist Pflicht').trim(),
  staatsangehoerigkeit: z.string().min(1, 'Staatsangehörigkeit ist Pflicht').trim(),

  // Anschrift Schüler:in
  strasse: z.string().min(1, 'Straße ist Pflicht').trim(),
  hausnummer: z.string().min(1, 'Hausnummer ist Pflicht').trim(),
  plz: z.string().regex(/^\d{5}$/, 'Postleitzahl: genau 5 Ziffern').trim(),
  wohnort: z.string().min(1, 'Wohnort ist Pflicht').trim(),
  staat: z.string().min(1, 'Staat ist Pflicht').trim(),

  // Schulbesuch
  jahrgangsstufe: z.string().min(1, 'Jahrgangsstufe ist Pflicht').trim(),
  schulbesuchEnde: dateSchema,

  // Schule
  schulname: z.string().min(1, 'Name der Schule ist Pflicht').trim(),
  schuleStrasse: z.string().min(1, 'Straße der Schule ist Pflicht').trim(),
  schuleHausnummer: z.string().min(1, 'Hausnummer der Schule ist Pflicht').trim(),
  schulePlz: z.string().regex(/^\d{5}$/, 'Postleitzahl: genau 5 Ziffern').trim(),
  schuleOrt: z.string().min(1, 'Ort der Schule ist Pflicht').trim(),
  schuleTelefon: z.string().min(1, 'Telefon der Schule ist Pflicht').trim(),
  schuleFax: z.string().optional().or(z.literal('')),
  artDerTraegerschaft: z.string().min(1, 'Art der Trägerschaft ist Pflicht').trim(),
  schulform: z.string().min(1, 'Schulform ist Pflicht').trim(),
});

export type SchulbescheinigungFormData = z.infer<typeof schulbescheinigungSchema>;
