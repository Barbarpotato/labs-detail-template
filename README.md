
# Labs Details Page: Multi-Cluster Update Workflow

## 📌 Problem
When all nodes are already deployed, updating the lab details page across all clusters becomes cumbersome. A single node update should propagate to all nodes seamlessly to avoid inconsistencies and manual overhead.

## ✅ Goal
Ensure **one trigger (e.g., a commit)** updates the **lab details page across all cluster nodes**.

## 🛠️ Solution Overview
We use a **centralized template repo** (`lab-detail-template`) that, upon commit, triggers a pipeline to update **all clusters**.

## 🧩 Components & Flow

1. **lab-detail-template**
   - Source repo containing `[slug].js` file template for labs page.
   - Any commit to this repo triggers the process.

2. **GitHub Commit**
   - Triggers GitHub workflow → hits API endpoint:
     ```
     https://api-barbarpotato.vercel.app/webhook/update-lab
     ```

3. **API Endpoint**
   - Iterates over all nodes (`labs-1`, `labs-2`, ..., `labs-N`)
   - Sends webhook to each node with:
     - `index` (node identifier)
     - `repo_name` for context

4. **labs-N Nodes**
   - Each node listens for the webhook.
   - On trigger, starts GitHub Actions to:
     - Clone `lab-detail-template`
     - Replace dynamic values (e.g., `index`)
     - Deploy the updated labs page

## 🔄 End-to-End Flow

```
Commit to lab-detail-template →
  Triggers GitHub Workflow →
    Calls central API →
      Loops over all labs-N nodes →
        Sends webhooks →
          Each node triggers GitHub Actions →
            Clones template + replaces [slug].js →
              Updates lab detail page
```

## 📌 Key Notes

- Centralized update mechanism.
- Supports dynamic [slug]/index-based rendering.
- All clusters stay in sync via webhook-triggered workflows.
- Reduces update overhead and prevents partial deployments.
