export const selectData = {
  id: true,
  poster_id: true,
  title: true,
  description: true,
  categories: {
    select: {
      name: true,
      description: true,
    },
  },
  budget: true,
  status: true,
  deadline: true,
  location: true,
  work_type: true,
  commitment: true,
  experience_level: true,
  payment_type: true,
  skills: true,
  created_at: true,
  updated_at: true,
};
