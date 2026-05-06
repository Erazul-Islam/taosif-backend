-- CreateTable
CREATE TABLE "SendMessage" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "content" TEXT NOT NULL,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SendMessage_pkey" PRIMARY KEY ("id")
);
