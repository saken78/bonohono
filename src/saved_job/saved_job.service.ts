import { prismaService } from "../db/MariaDB";
import type {
  CreateSavedJobResponse,
  GetSavedJobResult,
} from "./saved_job.model";

export const SavedJobService = {
  async GetSavedJobByUserId(user_id: string): Promise<GetSavedJobResult[]> {
    const saved_job = await prismaService.$queryRaw<GetSavedJobResult[]>`
    SELECT
    sj.id as saved_job_id, sj.user_id, sj.job_id, sj.created_at as saved_at, 
    j.id, j.poster_id, j.title, j.description, j.category_id, j.budget, j.status, 
    j.deadline, j.location, j.created_at, j.updated_at,
        CASE
        WHEN u.last_name IS NULL
        OR u.last_name = "" THEN u.first_name
        ELSE CONCAT(
            u.first_name,
            " ",
            u.last_name
        )
    END as name,
    u.email as poster_email,
    u.avatar as poster_avatar
FROM
    saved_jobs as sj
    JOIN jobs as j ON sj.job_id = j.id
    JOIN users as u ON j.poster_id = u.id
WHERE
    sj.user_id = ${user_id}
ORDER BY sj.created_at DESC`;
    return saved_job;
  },
  async GetSavedJobByUserIdAndJobId(
    user_id: string,
    job_id: string,
  ): Promise<GetSavedJobResult[]> {
    const jobs = await prismaService.$queryRaw<GetSavedJobResult[]>`SELECT
    sj.id as saved_job_id, sj.user_id, sj.job_id, sj.created_at as saved_at, 
    j.id, j.poster_id, j.title, j.description, j.category_id, j.budget, j.status, 
    j.deadline, j.location, j.created_at, j.updated_at,
        CASE
        WHEN u.last_name IS NULL
        OR u.last_name = "" THEN u.first_name
        ELSE CONCAT(
            u.first_name,
            " ",
            u.last_name
        )
    END as name,
    u.email as poster_email,
    u.avatar as poster_avatar
FROM
    saved_jobs as sj
    JOIN jobs as j ON sj.job_id = j.id
    JOIN users as u ON j.poster_id = u.id
WHERE
    sj.user_id = ${user_id}
    sj.job_id= ${job_id}
ORDER BY sj.created_at DESC`;
    return jobs;
  },
  async CreateSavedJob(
    user_id: string,
    job_id: string,
  ): Promise<CreateSavedJobResponse> {
    const job = await prismaService.saved_jobs.create({
      data: { user_id: user_id, job_id: job_id },
      select: { job_id: true },
    });
    return job;
  },
  async DeleteSavedJob(user_id: string, job_id: string): Promise<void> {
    await prismaService.$executeRaw`
    DELETE from saved_jobs where job_id = ${job_id} 
    AND user_id = ${user_id}`;
  },
};
