<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

/**
 * Class Transaction
 * 
 * @property int $id
 * @property string|null $tenant_id
 * @property int|null $establishment_id
 * @property int|null $appointment_id
 * @property int $customer_id
 * @property int|null $professional_id
 * @property string $transaction_code
 * @property string $type
 * @property float $subtotal
 * @property float $discount
 * @property float $tip
 * @property float $tax
 * @property float $total
 * @property string $currency
 * @property string|null $payment_method
 * @property string|null $mixed_payments
 * @property string|null $payment_gateway
 * @property string|null $gateway_transaction_id
 * @property string|null $gateway_response
 * @property string $status
 * @property Carbon|null $paid_at
 * @property Carbon|null $refunded_at
 * @property float $refund_amount
 * @property string|null $refund_reason
 * @property float $professional_commission
 * @property float $platform_fee
 * @property float $establishment_net
 * @property string|null $invoice_number
 * @property string|null $invoice_url
 * @property int|null $processed_by
 * @property string|null $notes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string|null $deleted_at
 * 
 * @property Appointment|null $appointment
 * @property User|null $user
 * @property Establishment|null $establishment
 * @property Tenant|null $tenant
 *
 * @package App\Models
 */
class Transaction extends Model
{
	use SoftDeletes;
	use BelongsToTenant;
	protected $table = 'transactions';

	protected $casts = [
		'establishment_id' => 'int',
		'appointment_id' => 'int',
		'customer_id' => 'int',
		'professional_id' => 'int',
		'subtotal' => 'float',
		'discount' => 'float',
		'tip' => 'float',
		'tax' => 'float',
		'total' => 'float',
		'paid_at' => 'datetime',
		'refunded_at' => 'datetime',
		'refund_amount' => 'float',
		'professional_commission' => 'float',
		'platform_fee' => 'float',
		'establishment_net' => 'float',
		'processed_by' => 'int'
	];

	protected $fillable = [
		'tenant_id',
		'establishment_id',
		'appointment_id',
		'customer_id',
		'professional_id',
		'transaction_code',
		'type',
		'subtotal',
		'discount',
		'tip',
		'tax',
		'total',
		'currency',
		'payment_method',
		'mixed_payments',
		'payment_gateway',
		'gateway_transaction_id',
		'gateway_response',
		'status',
		'paid_at',
		'refunded_at',
		'refund_amount',
		'refund_reason',
		'professional_commission',
		'platform_fee',
		'establishment_net',
		'invoice_number',
		'invoice_url',
		'processed_by',
		'notes'
	];

	public function appointment()
	{
		return $this->belongsTo(Appointment::class);
	}

	public function user()
	{
		return $this->belongsTo(User::class, 'professional_id');
	}

	public function establishment()
	{
		return $this->belongsTo(Establishment::class);
	}

	public function tenant()
	{
		return $this->belongsTo(Tenant::class);
	}
}
