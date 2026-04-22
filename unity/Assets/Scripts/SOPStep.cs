using System;
using UnityEngine;

namespace MkTech.PharmaSim
{
    /// <summary>
    /// A single step in a Standard Operating Procedure.
    /// Mirrors `src/lib/changeover-flow.ts` and `src/lib/aseptic-flow.ts` on the web side.
    /// Keep step IDs identical across platforms so xAPI activity IDs align.
    /// </summary>
    [Serializable]
    public class SOPStep
    {
        public string id;
        public int order;
        public string title;
        [TextArea(2, 5)] public string instruction;
        public string hint;
        public string hotspotKey;
        public Criticality criticality;
        public string commonDeviation;
        public CleanroomGrade grade;
    }

    public enum Criticality { Minor, Major, Critical }
    public enum CleanroomGrade { None, A, B, C, D }
}
