<script lang="ts">
    import type { PageData } from './$types';

    let { data }: { data: PageData } = $props();

    console.log(data.teacher.students[0].teacher.students[1].teacher, data.teacher);
</script>