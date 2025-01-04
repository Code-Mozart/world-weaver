import type { PageServerLoad } from './$types';

interface Teacher {
    students: Student[]
}

interface Student {
    teacher: Teacher
}

export const load = (async () => {
    const teacher: Teacher = {
        students: []
    };
    const students: Student[] = new Array(8).fill({ teacher });
    teacher.students = students;

    return {teacher};
}) satisfies PageServerLoad;