using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Events;

namespace MkTech.PharmaSim
{
    /// <summary>
    /// Session state machine — the Unity equivalent of `src/lib/session-store.ts`.
    /// One instance per scene. Runs the SOP flow, tracks deviations, computes
    /// the final score and submits an xAPI statement on completion.
    /// </summary>
    public class SessionManager : MonoBehaviour
    {
        public static SessionManager Instance { get; private set; }

        [Header("Scenario")]
        public Scenario scenario;

        [Header("Identity (fill from SSO handoff)")]
        public string actorName;
        public string actorId;
        public string plantId;

        [Header("Events")]
        public UnityEvent<SOPStep> onStepCompleted;
        public UnityEvent<string> onDeviationRecorded;
        public UnityEvent<float> onSessionCompleted;

        public List<string> completed = new List<string>();
        public List<Deviation> deviations = new List<Deviation>();
        public int currentIndex;
        public bool finished;
        public float startTime;

        [Serializable]
        public struct Deviation
        {
            public string stepId;
            public string message;
            public float at;
        }

        void Awake()
        {
            Instance = this;
        }

        public void StartSession()
        {
            if (scenario == null || scenario.steps.Count == 0)
            {
                Debug.LogError("[PharmaSim] Cannot start: scenario not assigned.");
                return;
            }
            completed.Clear();
            deviations.Clear();
            currentIndex = 0;
            finished = false;
            startTime = Time.time;
        }

        public void TryHotspot(string hotspotKey)
        {
            if (finished || currentIndex >= scenario.steps.Count) return;
            var expected = scenario.steps[currentIndex];

            if (expected.hotspotKey != hotspotKey)
            {
                var d = new Deviation
                {
                    stepId = expected.id,
                    message = $"Out-of-sequence '{hotspotKey}' — expected '{expected.hotspotKey}' ({expected.title})",
                    at = Time.time - startTime,
                };
                deviations.Add(d);
                onDeviationRecorded?.Invoke(d.message);
                return;
            }

            completed.Add(expected.id);
            currentIndex++;
            onStepCompleted?.Invoke(expected);

            if (currentIndex >= scenario.steps.Count)
            {
                finished = true;
                var scaled = Score();
                onSessionCompleted?.Invoke(scaled);
                SubmitXApi(scaled);
            }
        }

        public float Score()
        {
            if (scenario == null || scenario.steps.Count == 0) return 0f;
            var baseScore = (float)completed.Count / scenario.steps.Count;
            var penalty = Mathf.Min(0.4f, deviations.Count * 0.05f);
            return Mathf.Clamp01(baseScore - penalty);
        }

        private void SubmitXApi(float scaled)
        {
            var client = FindObjectOfType<XApiClient>();
            if (client == null)
            {
                Debug.LogWarning("[PharmaSim] No XApiClient in scene — statement not submitted.");
                return;
            }
            var durationSec = Time.time - startTime;
            client.PostCompletionAsync(
                actorName,
                actorId,
                scenario.activityId,
                scenario.title,
                scenario.machineId,
                scaled,
                durationSec,
                deviations.Count,
                plantId
            );
        }
    }
}
