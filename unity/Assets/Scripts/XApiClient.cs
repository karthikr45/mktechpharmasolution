using System;
using System.Collections;
using System.Text;
using UnityEngine;
using UnityEngine.Networking;

namespace MkTech.PharmaSim
{
    /// <summary>
    /// Thin xAPI client that posts to the web portal's /api/xapi/statements
    /// endpoint. Mirrors the statement shape validated by `src/lib/xapi.ts`
    /// (Zod) on the server side.
    /// </summary>
    public class XApiClient : MonoBehaviour
    {
        [Tooltip("Portal base URL (e.g. https://pharmasim.mktech.dev).")]
        public string portalBaseUrl = "http://localhost:3000";

        [Tooltip("Bearer token for pilot auth (fill from SSO). Optional in dev.")]
        public string authToken;

        public void PostCompletionAsync(
            string actorName,
            string actorId,
            string activityId,
            string activityName,
            string machineId,
            float scaled,
            float durationSec,
            int deviationsCount,
            string plantId)
        {
            StartCoroutine(PostCoroutine(
                actorName, actorId, activityId, activityName,
                machineId, scaled, durationSec, deviationsCount, plantId));
        }

        IEnumerator PostCoroutine(
            string actorName, string actorId, string activityId, string activityName,
            string machineId, float scaled, float durationSec, int deviationsCount, string plantId)
        {
            var verbIri = scaled >= 0.7f
                ? "http://adlnet.gov/expapi/verbs/passed"
                : "http://adlnet.gov/expapi/verbs/failed";

            var json = BuildJson(
                actorName, actorId, verbIri, activityId, activityName,
                machineId, scaled, durationSec, deviationsCount, plantId);

            var url = portalBaseUrl.TrimEnd('/') + "/api/xapi/statements";
            var req = new UnityWebRequest(url, "POST");
            req.uploadHandler = new UploadHandlerRaw(Encoding.UTF8.GetBytes(json));
            req.downloadHandler = new DownloadHandlerBuffer();
            req.SetRequestHeader("Content-Type", "application/json");
            if (!string.IsNullOrEmpty(authToken))
                req.SetRequestHeader("Authorization", "Bearer " + authToken);

            yield return req.SendWebRequest();
            if (req.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError("[PharmaSim] xAPI submit failed: " + req.error);
            }
            else
            {
                Debug.Log("[PharmaSim] xAPI statement submitted.");
            }
        }

        private static string Esc(string s) =>
            string.IsNullOrEmpty(s) ? "" : s.Replace("\\", "\\\\").Replace("\"", "\\\"");

        /// <summary>
        /// Hand-rolled JSON to avoid dragging in a serializer dependency.
        /// Replace with System.Text.Json / Newtonsoft once project allows.
        /// </summary>
        private string BuildJson(
            string actorName, string actorId, string verbIri,
            string activityId, string activityName,
            string machineId, float scaled, float durationSec, int deviationsCount,
            string plantId)
        {
            var sb = new StringBuilder();
            sb.Append("{");
            sb.Append("\"actor\":{");
            sb.Append("\"objectType\":\"Agent\",");
            sb.Append($"\"name\":\"{Esc(actorName)}\",");
            sb.Append("\"account\":{");
            sb.Append("\"homePage\":\"https://mktech.pharma/users\",");
            sb.Append($"\"name\":\"{Esc(actorId)}\"");
            sb.Append("}");
            sb.Append("},");
            sb.Append("\"verb\":{");
            sb.Append($"\"id\":\"{verbIri}\",");
            sb.Append($"\"display\":{{\"en-US\":\"{(scaled >= 0.7f ? "passed" : "failed")}\"}}");
            sb.Append("},");
            sb.Append("\"object\":{");
            sb.Append($"\"id\":\"{Esc(activityId)}\",");
            sb.Append("\"definition\":{");
            sb.Append($"\"name\":{{\"en-US\":\"{Esc(activityName)}\"}},");
            sb.Append("\"type\":\"http://adlnet.gov/expapi/activities/simulation\"");
            sb.Append("}");
            sb.Append("},");
            sb.Append("\"result\":{");
            sb.Append($"\"success\":{(scaled >= 0.7f ? "true" : "false")},");
            sb.Append("\"completion\":true,");
            sb.Append($"\"score\":{{\"scaled\":{scaled.ToString("0.###")}}},");
            sb.Append($"\"duration\":\"PT{Mathf.Max(1, Mathf.RoundToInt(durationSec))}S\",");
            sb.Append("\"extensions\":{");
            sb.Append($"\"https://mktech.pharma/ext/deviations\":{deviationsCount}");
            sb.Append("}");
            sb.Append("},");
            sb.Append("\"context\":{");
            sb.Append("\"platform\":\"mktech-pharmasim-quest\",");
            sb.Append("\"extensions\":{");
            sb.Append($"\"https://mktech.pharma/ext/machine-id\":\"{Esc(machineId)}\",");
            sb.Append($"\"https://mktech.pharma/ext/plant-id\":\"{Esc(plantId)}\"");
            sb.Append("}");
            sb.Append("},");
            sb.Append($"\"timestamp\":\"{DateTime.UtcNow:yyyy-MM-ddTHH:mm:ss.fffZ}\"");
            sb.Append("}");
            return sb.ToString();
        }
    }
}
