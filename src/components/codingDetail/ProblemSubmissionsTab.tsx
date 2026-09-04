import styles from "@/pages/coding/CodingDetail.module.css";
import type { ProblemSubmissionsTabProps, UserSubmission } from "./types";

function getStatusLabel(status: UserSubmission["status"]): string {
  switch (status) {
    case "accepted":
      return "Accepted ✓";
    case "runtime_error":
      return "Runtime Error ✕";
    default:
      return "Wrong Answer ✕";
  }
}

export function ProblemSubmissionsTab({
  submissions,
}: Readonly<ProblemSubmissionsTabProps>) {
  return (
    <div className={styles.submissionsTabContent}>
      <h2 className={styles.editorialHeading}>Submission History</h2>
      {submissions.length > 0 ? (
        <div className={styles.submissionList}>
          {submissions.map((sub) => (
            <div key={sub.id} className={styles.submissionRecord}>
              <div className={styles.submissionStatus}>
                <span
                  className={
                    sub.status === "accepted"
                      ? styles.acceptedTag
                      : styles.wrongAnswerTag
                  }
                >
                  {getStatusLabel(sub.status)}
                </span>
                <span className={styles.submissionDate}>
                  {sub.timestamp}
                </span>
              </div>
              <div className={styles.submissionStats}>
                <span>
                  Passed:{" "}
                  <strong>
                    {sub.passedCases}/{sub.totalCases}
                  </strong>{" "}
                  test cases
                </span>
                <span>
                  Runtime: <strong>{sub.runtimeMs} ms</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.noSubmissions}>
          <p>
            No submissions yet. Write your code and click{" "}
            <strong>Submit</strong>!
          </p>
        </div>
      )}
    </div>
  );
}
