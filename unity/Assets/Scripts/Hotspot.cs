using UnityEngine;
using UnityEngine.Events;

namespace MkTech.PharmaSim
{
    /// <summary>
    /// An interactable on a 3D object — equivalent to a click target in the
    /// web simulator. Wire up to the XR Interaction Toolkit's
    /// XRSimpleInteractable component on Quest.
    /// </summary>
    public class Hotspot : MonoBehaviour
    {
        [Tooltip("Must match a SOPStep.hotspotKey (e.g. 'turret', 'mirror').")]
        public string hotspotKey;

        [Tooltip("Shown as a floating label above the hotspot.")]
        public string label;

        public UnityEvent onPicked = new UnityEvent();
        [HideInInspector] public bool active;

        /// <summary>
        /// Called by the XRSimpleInteractable's selectEntered event (or by
        /// a fallback pointer click when testing without a headset).
        /// </summary>
        public void Pick()
        {
            onPicked?.Invoke();
            SessionManager.Instance?.TryHotspot(hotspotKey);
        }
    }
}
