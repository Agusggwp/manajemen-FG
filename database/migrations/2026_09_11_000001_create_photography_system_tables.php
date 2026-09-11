<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Customers
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 2. MUAs
        Schema::create('muas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->string('profile_photo')->nullable();
            $table->string('specialty')->nullable();
            $table->text('bio')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        // 3. Photo Packages
        Schema::create('photo_packages', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category'); // Wedding, Graduation, Portrait, Product, Event, Prewedding, Commercial, Other
            $table->decimal('price', 12, 2)->default(0);
            $table->integer('duration_minutes')->default(60);
            $table->integer('number_of_photos')->default(0);
            $table->integer('number_of_photographers')->default(1);
            $table->boolean('includes_mua')->default(false);
            $table->decimal('estimated_photographer_cost', 12, 2)->default(0);
            $table->decimal('estimated_mua_fee', 12, 2)->default(0);
            $table->decimal('estimated_operational_cost', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->json('features')->nullable();
            $table->enum('status', ['ACTIVE', 'INACTIVE'])->default('ACTIVE');
            $table->timestamps();
            $table->softDeletes();
        });

        // 4. Bookings
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('photo_package_id')->nullable()->constrained('photo_packages')->onDelete('set null');
            $table->date('booking_date');
            $table->string('status')->default('PENDING'); // PENDING, CONFIRMED, CANCELLED
            $table->text('notes')->nullable();
            
            // Package Snapshot fields
            $table->string('package_name');
            $table->decimal('package_price', 12, 2)->default(0);
            $table->integer('package_duration')->default(60);
            $table->boolean('package_includes_mua')->default(false);

            $table->timestamps();
            $table->softDeletes();
        });

        // 5. Schedules (Must have location!)
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('photo_package_id')->nullable()->constrained('photo_packages')->onDelete('set null');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            
            // Mandatory Location fields
            $table->string('location_name');
            $table->text('location_address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('location_radius')->default(100); // meters
            $table->text('location_notes')->nullable();
            
            $table->text('notes')->nullable();
            $table->enum('status', ['SCHEDULED', 'SHOOTING', 'COMPLETED', 'CANCELLED'])->default('SCHEDULED');
            $table->timestamps();
            $table->softDeletes();
        });

        // 6. Projects
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('project_code')->unique();
            $table->string('project_name');
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->onDelete('set null');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('photo_package_id')->nullable()->constrained('photo_packages')->onDelete('set null');

            // Snapshot package info
            $table->string('package_name');
            $table->decimal('package_price', 12, 2)->default(0);
            $table->integer('package_duration')->default(60);
            $table->boolean('package_includes_mua')->default(false);

            $table->date('date');
            $table->string('location_name');
            $table->text('location_address');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->integer('location_radius')->default(100);

            $table->enum('status', [
                'PLANNING', 'SCHEDULED', 'SHOOTING', 'EDITING', 'REVIEW', 'COMPLETED', 'DELIVERED', 'CANCELLED'
            ])->default('PLANNING');

            $table->text('notes')->nullable();
            $table->date('deadline')->nullable();

            // Actual work duration
            $table->time('work_start_time')->nullable();
            $table->time('work_end_time')->nullable();
            $table->integer('work_duration_minutes')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });

        // 7. Project Photographers Pivot
        Schema::create('project_photographers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('photographer_id')->constrained('users')->onDelete('cascade');
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // 8. Project MUAs Pivot
        Schema::create('project_muas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('mua_id')->constrained('muas')->onDelete('cascade');
            $table->string('notes')->nullable();
            $table->timestamps();
        });

        // 9. Photographer Project Salaries (Gaji per project)
        Schema::create('photographer_project_salaries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('photographer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 12, 2)->default(0);
            $table->time('work_start_time')->nullable();
            $table->time('work_end_time')->nullable();
            $table->integer('work_duration_minutes')->nullable();
            $table->enum('payment_status', ['UNPAID', 'PAID', 'CANCELLED'])->default('UNPAID');
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->text('payment_note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 10. MUA Project Fees (Fee per project)
        Schema::create('mua_project_fees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('mua_id')->constrained('muas')->onDelete('cascade');
            $table->decimal('amount', 12, 2)->default(0);
            $table->time('work_start_time')->nullable();
            $table->time('work_end_time')->nullable();
            $table->integer('work_duration_minutes')->nullable();
            $table->enum('payment_status', ['UNPAID', 'PAID', 'CANCELLED'])->default('UNPAID');
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->text('payment_note')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 11. Photo Session Proofs (START & END Proofs with GPS + Haversine distance)
        Schema::create('photo_session_proofs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            $table->foreignId('project_id')->nullable()->constrained('projects')->onDelete('set null');
            $table->foreignId('photographer_id')->constrained('users')->onDelete('cascade');
            $table->enum('type', ['START', 'END']);
            $table->string('photo_path');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('accuracy', 8, 2)->default(0);
            $table->decimal('distance_from_location', 10, 2)->default(0); // in meters
            $table->timestamp('captured_at');
            $table->enum('status', [
                'START_PENDING', 'START_VALID', 'START_REJECTED',
                'END_PENDING', 'END_VALID', 'END_REJECTED'
            ])->default('START_PENDING');
            $table->foreignId('admin_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('admin_note')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();
        });

        // 12. Project Expenses (Biaya Operasional)
        Schema::create('project_expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('name');
            $table->decimal('amount', 12, 2)->default(0);
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // 13. Project Galleries
        Schema::create('project_galleries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->foreignId('photographer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('file_path');
            $table->string('file_name')->nullable();
            $table->bigInteger('file_size')->default(0);
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 14. Activity Logs
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action');
            $table->string('module');
            $table->unsignedBigInteger('record_id')->nullable();
            $table->text('description');
            $table->string('ip_address')->nullable();
            $table->timestamps();
        });

        // 15. System Settings
        Schema::create('system_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('group')->default('general');
            $table->string('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_settings');
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('project_galleries');
        Schema::dropIfExists('project_expenses');
        Schema::dropIfExists('photo_session_proofs');
        Schema::dropIfExists('mua_project_fees');
        Schema::dropIfExists('photographer_project_salaries');
        Schema::dropIfExists('project_muas');
        Schema::dropIfExists('project_photographers');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('schedules');
        Schema::dropIfExists('bookings');
        Schema::dropIfExists('photo_packages');
        Schema::dropIfExists('muas');
        Schema::dropIfExists('customers');
    }
};
