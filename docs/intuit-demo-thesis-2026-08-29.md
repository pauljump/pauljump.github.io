# Intuit demo thesis

This note captures the product idea behind the Intuit demo and the public-safe context behind it.

## The starting point

OPWDDKit is the visible MVP. The important idea is the system behind it, not the specific domain.

Start with a messy, high-value workflow. Ingest the rules, documents, entities, and exceptions that currently live across people and systems. Turn that material into a structured evidence layer. Build the workflow around the evidence. Use models and agents where they reduce work, preserve the source material behind each conclusion, and keep a human accountable for decisions that require judgment. Then use outcomes and new cases to improve the system over time.

The result is not a chatbot. It is a learning workflow system with ingestion, retrieval, rules, evidence, evaluation, human review, and an operating loop.

## Four deployment motions

### 1. Direct workflow deployment

Build an AI-native product for a specific customer, operator, or underserved workflow. OPWDDKit demonstrates the shape: replace fragmented manual work with an evidence-backed workflow that makes the next action clear while exposing uncertainty and missing information.

### 2. Trusted intermediary deployment

Deploy through the professionals and organizations already responsible for the work: accountants, bookkeepers, lawyers, schools, agencies, healthcare organizations, and other trusted intermediaries. The intermediary supplies context and judgment; the system supplies memory, preparation, consistency, and scale.

### 3. Product and platform deployment

Extract the reusable capabilities from each deployment: structured ingestion, entity resolution, rules and policy representation, evidence graphs, workflow orchestration, approvals, evaluations, private-model support, and agent-ready APIs. Customer work becomes product infrastructure instead of a growing collection of one-off implementations.

### 4. Software-factory deployment

Use a repeatable factory to discover narrow problems, generate candidate workflows, simulate users and firms, evaluate them, and advance the ones that demonstrate real utility. Teek, the current multi-agent evaluation work, MCP tooling, local-model experiments, and the broader AI factory are examples of the machinery behind this motion.

## What to demonstrate for Intuit

The strongest demo should begin with OPWDDKit, then show how the same architecture could apply to an Intuit workflow involving sensitive records, changing rules, expert intermediaries, and a high cost of error.

The demo should make five things visible:

1. What the user had to do before.
2. What sources and rules the system ingests.
3. How the system produces a recommendation, preparation, or next action.
4. How evidence, uncertainty, exceptions, and human review are represented.
5. How one deployment becomes a reusable capability and then a factory for adjacent workflows.

The product question is not “can a model answer this?” It is “what system makes the answer dependable enough to become part of the workflow?”

## Boundaries

This is a product thesis and demo direction, not a claim about Intuit’s internal roadmap or systems. The demo should use synthetic or public-safe data and clearly label what is real, mocked, or proposed.
