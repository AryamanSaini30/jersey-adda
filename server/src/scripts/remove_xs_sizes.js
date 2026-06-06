const supabase = require('../config/supabase');

async function removeXS() {
  console.log('Fetching all jerseys from database...');
  const { data: jerseys, error } = await supabase
    .from('jerseys')
    .select('id, name, available_sizes');

  if (error) {
    console.error('Failed to fetch jerseys:', error);
    process.exit(1);
  }

  console.log(`Found ${jerseys.length} jerseys. Checking available_sizes...`);
  let updateCount = 0;

  for (const jersey of jerseys) {
    const sizes = jersey.available_sizes || [];
    if (sizes.includes('XS')) {
      const updatedSizes = sizes.filter((s) => s !== 'XS');
      console.log(`Updating jersey "${jersey.name}" (ID: ${jersey.id}):`, sizes, '->', updatedSizes);

      const { error: updateError } = await supabase
        .from('jerseys')
        .update({ available_sizes: updatedSizes })
        .eq('id', jersey.id);

      if (updateError) {
        console.error(`Failed to update sizes for "${jersey.name}":`, updateError);
      } else {
        console.log(`Successfully updated "${jersey.name}"`);
        updateCount++;
      }
    }
  }

  console.log(`Finished updating sizes. Total jerseys updated: ${updateCount}`);
  process.exit(0);
}

removeXS().catch((err) => {
  console.error('Unhandled migration error:', err);
  process.exit(1);
});
