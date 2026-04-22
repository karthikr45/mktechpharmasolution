using System.Collections.Generic;
using UnityEngine;

namespace MkTech.PharmaSim
{
    /// <summary>
    /// ScriptableObject describing one training scenario (e.g. tablet press
    /// changeover, aseptic intervention). Created in the Unity Editor and
    /// referenced by SessionManager at runtime.
    /// </summary>
    [CreateAssetMenu(fileName = "Scenario", menuName = "PharmaSim/Scenario")]
    public class Scenario : ScriptableObject
    {
        [Tooltip("Must match the SOP id on the web portal (e.g. sop_tp_001).")]
        public string id;

        public string title;
        [TextArea(1, 2)] public string subtitle;
        public string machineId;

        [Tooltip("xAPI activity IRI (must match the web portal).")]
        public string activityId;

        public List<SOPStep> steps = new List<SOPStep>();
    }
}
