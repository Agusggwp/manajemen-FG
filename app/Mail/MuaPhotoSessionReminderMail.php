<?php

namespace App\Mail;

use App\Models\Mua;
use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MuaPhotoSessionReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public Schedule $schedule;
    public Mua $mua;

    /**
     * Create a new message instance.
     */
    public function __construct(Schedule $schedule, Mua $mua)
    {
        $this->schedule = $schedule;
        $this->mua = $mua;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $dateFormatted = is_string($this->schedule->date) 
            ? $this->schedule->date 
            : $this->schedule->date->format('d M Y');

        return new Envelope(
            subject: "Pengingat Tugas MUA H-1 [{$dateFormatted}] - ARTDEVATA",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.photo_session_reminder_mua',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
