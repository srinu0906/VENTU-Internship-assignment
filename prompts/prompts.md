# AI Evaluation Prompts

*Recycling Production Line Manager Candidate Scoring*

These prompts are used to independently evaluate each candidate on three core competencies using a large language model.

Each prompt returns a **numeric score from 1 to 10 only**.

##  Notes

* `{{experience}}` and `{{skills}}` are dynamically populated from the database
* Each prompt is sent independently to the AI
* Output is parsed as a numeric score

---

---

##  1. Crisis Management Prompt

```
Rate crisis management ability of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: {{experience}} years  
Skills: {{skills}}

Return only a number.
```
---

##  2. Sustainability Knowledge Prompt

```
Evaluate sustainability knowledge of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: {{experience}} years  
Skills: {{skills}}

Return only a number.
```

---

##  3. Team Motivation & Leadership Prompt

```
Score team motivation and leadership of this candidate on the scale from 1 to 10 for a recycling production line manager.

Experience: {{experience}} years  
Skills: {{skills}}

Return only a number.
```


---




