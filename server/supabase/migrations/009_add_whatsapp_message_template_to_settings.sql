-- Add whatsapp_message_template column to settings table
alter table public.settings
  add column if not exists whatsapp_message_template text default $$DETAILS
ORDER NO:- {{order_number}}
NAME: {{customer_name}}
PH No:- {{customer_phone}}
ADDRESS:- {{customer_address}}
PINCODE:- {{postal_code}}
JERSEY:- {{order_items}}
TOTAL:- ₹{{total_amount}}
DATE:- {{order_date}}$$;

update public.settings
set whatsapp_message_template = default
where whatsapp_message_template is null;
