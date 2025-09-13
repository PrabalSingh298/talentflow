import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadNotes, addNote } from "../../store/notesSlice";

function NotesTest() {
    const dispatch = useDispatch();
    const notes = useSelector((state) => state.notes.list);

    useEffect(() => {
        const candidateId = "cand-1";

        dispatch(
            addNote({
                id: Date.now().toString(),
                candidateId,
                content: "This is a test note with @HR mention",
                createdAt: new Date().toISOString(),
                mentions: ["HR"],
            })
        ).then(() => {
            dispatch(loadNotes(candidateId));
        });
    }, [dispatch]);

    return (
        <div>
            <h2>Notes Test</h2>
            <ul>
                {notes.map((n) => (
                    <li key={n.id}>
                        {n.content} <small>({n.createdAt})</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default NotesTest;
