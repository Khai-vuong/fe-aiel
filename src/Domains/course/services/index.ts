// Export old courseService (fetch-based)
// export { CourseService } from './course.service';

// Export new CourseService class (axios-based)
export {
  default as courseServiceInstance,
  CourseService,
  type EnrollmentWithStudent,
  type EnrollmentWithCourse,
  type EnrollmentResponse,
  type DeleteCourseResponse,
} from './course.service';
