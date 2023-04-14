import { Migration } from '../cli/migration';
import { PrismaService } from '../../src/prisma/prisma.service';

const prisma = new PrismaService();

export default class implements Migration {
  async up() {
    try {
      await prisma.$queryRaw`CREATE TABLE "users" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "username" VARCHAR(255) NOT NULL,
        "password" VARCHAR(255) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;
      await prisma.$queryRaw`CREATE TABLE "movies" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "title" VARCHAR(255) NOT NULL,
        "description" VARCHAR(255) NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await prisma.$queryRaw`CREATE TABLE "showrooms" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(255) NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await prisma.$queryRaw`CREATE TABLE "shows" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "movie_id" INT UNSIGNED NOT NULL,
        "showroom_id" INT UNSIGNED NOT NULL,
        "start_time" DATETIME NOT NULL,
        "price" INT UNSIGNED NOT NULL,
        "vip_seat_price" INT UNSIGNED NOT NULL,
        "couple_seat_price" INT UNSIGNED NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_id) REFERENCES movie (id) ON DELETE CASCADE,
        FOREIGN KEY (showroom_id) REFERENCES showroom (id) ON DELETE CASCADE
      )`;

      await prisma.$queryRaw`CREATE TABLE "seat_types" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "name" VARCHAR(255) NOT NULL,
        "premium_percentage" INT UNSIGNED NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )`;

      await prisma.$queryRaw`CREATE TABLE "seats" (
        "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        "show_id" INT UNSIGNED NOT NULL,
        "seat_type_id" INT UNSIGNED NOT NULL,
        "row_number" INT UNSIGNED NOT NULL,
        "seat_number" INT UNSIGNED NOT NULL,
        "booked" BOOLEAN NOT NULL DEFAULT FALSE,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (show_id) REFERENCES show (id) ON DELETE CASCADE,
        FOREIGN KEY (seat_type_id) REFERENCES seat_type (id) ON DELETE CASCADE
      )`;
    } catch (error) {
      console.log(error);
    }
  }

  async down() {
    await prisma.$queryRaw`DROP TABLE "users"`;
    await prisma.$queryRaw`DROP TABLE "movies"`;
    await prisma.$queryRaw`DROP TABLE "showrooms"`;
    await prisma.$queryRaw`DROP TABLE "shows"`;
    await prisma.$queryRaw`DROP TABLE "seat_types"`;
    await prisma.$queryRaw`DROP TABLE "seats"`;
  }
}
