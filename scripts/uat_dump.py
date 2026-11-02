#!/usr/bin/env python3
"""Print saved UAT call transcripts compactly, with tool calls + key call_output fields."""
import json,glob,sys,os
KEYS=("full_journey_completed","solution_enablers_discussed","disability_category_mapped",
      "matching_providers_found","providers_connected","update_profile_api_triggered",
      "update_profile_api_successful","connect_provider_api_triggered","drop_reason",
      "abandoned_at_stage","on_behalf_of","call_engaged")
pat=sys.argv[1]; only=sys.argv[2] if len(sys.argv)>2 else ""
for f in sorted(glob.glob(pat+"/*.json")):
    if only and only not in os.path.basename(f): continue
    c=json.load(open(f))
    print("="*72); print(os.path.basename(f), f"| dur={c.get('call_duration')}s turns={len(c.get('call_transcript') or [])}")
    for i,t in enumerate(c.get("call_transcript") or []):
        r=t.get("role")
        for tc in (t.get("tool_calls") or []):
            print(f"{i:2} [TOOL] {tc['function']['name']} {str(tc['function']['arguments'])[:260]}")
        ct=str(t.get("content") or "").replace("\n"," ")
        if ct:
            if r=="tool": ct=ct[:180]
            print(f"{i:2} [{r}] {ct[:250]}")
    co=c.get("call_output") or {}
    print("   OUT: "+" ".join(f"{k}={co.get(k)!r}" for k in KEYS if co.get(k) is not None))
