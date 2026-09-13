<?php

namespace Tests\Feature;

use App\Models\PhotoPackage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SecuritySqlInjectionTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'role' => 'ADMIN',
            'status' => 'ACTIVE',
        ]);
    }

    /**
     * Test public catalog search filter handles SQL injection payloads safely.
     */
    public function test_public_catalog_search_is_safe_from_sql_injection(): void
    {
        $payloads = [
            "' OR '1'='1",
            "' OR 1=1 --",
            "' OR 1=1 #",
            "admin'--",
            "1' UNION SELECT NULL, NULL, NULL--",
            "'; DROP TABLE users; --",
        ];

        foreach ($payloads as $payload) {
            $response = $this->get('/?search=' . urlencode($payload));
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page->component('Public/Packages'));
        }
    }

    /**
     * Test admin package index search and sort parameters handle malicious input safely.
     */
    public function test_admin_package_search_and_sort_is_safe_from_sql_injection(): void
    {
        $this->actingAs($this->admin);

        $payloads = [
            "' OR '1'='1",
            "1'; SELECT SLEEP(5); --",
            "name; DROP TABLE photo_packages;--",
        ];

        foreach ($payloads as $payload) {
            $response = $this->get('/admin/packages?search=' . urlencode($payload) . '&sort=' . urlencode($payload));
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page->component('Admin/Packages/Index'));
        }
    }

    /**
     * Test admin project search & status filter handle SQL injection safely.
     */
    public function test_admin_project_search_and_filter_is_safe(): void
    {
        $this->actingAs($this->admin);

        $payloads = [
            "' UNION SELECT 1,2,3--",
            "'; UPDATE users SET role='ADMIN'; --",
        ];

        foreach ($payloads as $payload) {
            $response = $this->get('/admin/projects?search=' . urlencode($payload) . '&status=' . urlencode($payload));
            $response->assertStatus(200);
            $response->assertInertia(fn ($page) => $page->component('Admin/Projects/Index'));
        }
    }

    /**
     * Test report export CSV is safe from SQL injection via start_date and category filters.
     */
    public function test_report_export_csv_is_safe_from_sql_injection(): void
    {
        $this->actingAs($this->admin);

        $payload = "' OR 1=1 --";

        $response = $this->get('/admin/reports/package-profit/export-csv?category=' . urlencode($payload) . '&start_date=' . urlencode($payload));
        $response->assertStatus(200);
        $response->assertHeader('content-type', 'text/csv; charset=UTF-8');
    }

    /**
     * Test activity log search filter handles SQL injection safely.
     */
    public function test_activity_log_search_is_safe(): void
    {
        $this->actingAs($this->admin);

        $payload = "' HAVING 1=1 --";

        $response = $this->get('/admin/activity-logs?search=' . urlencode($payload) . '&module=' . urlencode($payload));
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/ActivityLogs/Index'));
    }
}
