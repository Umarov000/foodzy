// src/mail/mail.service.ts
import { Injectable } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Users } from "../../generated/prisma";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendMail(user: Users) {
    const url = `${process.env.API_URL}/api/auth/activate/${user.activationLink}`;
    console.log(url);
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Welcome to FOODZY!",
      template: "confirmation",
      context: {
        fullName: user.fullName,
        url,
      },
    });
  }
  async sendResetPasswordEmail(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: "Password Reset Request",
      template: "./resetPassword",
      context: {
        otp: otp,
      },
    });
  }
}
