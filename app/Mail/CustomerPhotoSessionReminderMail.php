<?php

namespace App\Mail;

use App\Models\Schedule;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class CustomerPhotoSessionReminderMail extends Mailable
{
    use Queueable, SerializesModels;

    public Schedule $schedule;

    /**
     * Create a new message instance.
     */
    public function __construct(Schedule $schedule)
    {
        $this->schedule = $schedule;
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
            subject: "Peringatan Jadwal Pemotretan H-1 [{$dateFormatted}] - ARTDEVATA Photography",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.photo_session_reminder_customer',
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
