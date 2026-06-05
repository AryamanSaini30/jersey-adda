const supabase = require('../config/supabase');

const Settings = {
  async get() {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async update(newSettings) {
    const current = await this.get();
    const { data, error } = await supabase
      .from('settings')
      .update({
        whatsapp_number: newSettings.whatsapp_number,
        updated_at: new Date(),
      })
      .eq('id', current.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
};

module.exports = Settings;
