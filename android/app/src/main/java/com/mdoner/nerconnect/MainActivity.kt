package com.mdoner.nerconnect

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.AltRoute
import androidx.compose.material.icons.outlined.Check
import androidx.compose.material.icons.outlined.Engineering
import androidx.compose.material.icons.outlined.Explore
import androidx.compose.material.icons.outlined.Landslide
import androidx.compose.material.icons.outlined.LocationOn
import androidx.compose.material.icons.outlined.Navigation
import androidx.compose.material.icons.outlined.Send
import androidx.compose.material.icons.outlined.SignalCellularAlt
import androidx.compose.material.icons.outlined.Terrain
import androidx.compose.material.icons.outlined.Traffic
import androidx.compose.material.icons.outlined.Water
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

/* NER-Connect | Civil Infrastructure & Logistics design tokens (DESIGN.md) */
private val Primary = Color(0xFF002B2F)
private val PrimaryContainer = Color(0xFF004349)
private val OnPrimaryContainer = Color(0xFF7AAFB6)
private val PrimaryFixedDim = Color(0xFF9AD0D7)
private val Secondary = Color(0xFF006D3D)
private val SecondaryContainer = Color(0xFF99F3B6)
private val OnSecondaryContainer = Color(0xFF0B7141)
private val Tertiary = Color(0xFF2C18B5)
private val TertiaryContainer = Color(0xFF2C18B5)
private val ErrorRed = Color(0xFFBA1A1A)
private val ErrorContainer = Color(0xFFFFDAD6)
private val OnErrorContainer = Color(0xFF93000A)
private val SurfaceBg = Color(0xFFF8F9FF)
private val SurfaceLowest = Color(0xFFFFFFFF)
private val SurfaceLow = Color(0xFFEFF4FF)
private val SurfaceCont = Color(0xFFE6EEFF)
private val SurfaceHigh = Color(0xFFDCE9FF)
private val OnSurface = Color(0xFF0D1C2E)
private val OnSurfaceVariant = Color(0xFF404849)
private val OutlineVariant = Color(0xBFC8C9)
private val InkMuted = Color(0xFF64748B)

/* IMD 4-tier severity matrix */
data class Tier(val label: String, val bg: Color, val text: Color)
private val TIER1 = Tier("Clear", Color(0xFFEAF5EE), Color(0xFF1B5E20))
private val TIER2 = Tier("Watch", Color(0xFFFEF7E6), Color(0xFF946200))
private val TIER3 = Tier("Delay/Prep", Color(0xFFFFEDE0), Color(0xFF9A3412))
private val TIER4 = Tier("Blocked", Color(0xFFFCECEB), Color(0xFF8A1F11))

private data class Corridor(
    val road: String,
    val via: String,
    val tier: Tier,
    val note: String,
    val speed: String,
)

private val CORRIDORS = listOf(
    Corridor("NH-27 East-West Axis", "Bongaigaon - Silchar", TIER1, "Capacity: 8,400 trucks/day", "Avg 54 km/h"),
    Corridor("NH-10 Teesta Valley", "Siliguri - Gangtok", TIER2, "29th Mile heavy seepage", "Avg 18 km/h"),
    Corridor("NH-37 Kaziranga Stretch", "Jakhalabandha - Bokakhat", TIER1, "Speed capped 40 km/h (wildlife)", "Normal flow"),
    Corridor("NH-29 Chumukedima", "Dimapur - Kohima", TIER3, "Controlled convoy release", "Est delay +3.5h"),
)

private data class HazardType(val label: String, val sub: String)

private val HAZARDS = listOf(
    HazardType("Landslide / Rockfall", "Slope failure"),
    HazardType("Flash Flood / Runoff", "Waterlogging"),
    HazardType("Vehicle Stall / Block", "Convoy gridlock"),
    HazardType("Bridge / Culvert", "Structural damage"),
)

private val SEVERITY = listOf("Minor", "Moderate", "Severe")

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = Primary,
                    onPrimary = Color.White,
                    primaryContainer = PrimaryContainer,
                    onPrimaryContainer = OnPrimaryContainer,
                    secondary = Secondary,
                    secondaryContainer = SecondaryContainer,
                    onSecondaryContainer = OnSecondaryContainer,
                    tertiary = Tertiary,
                    tertiaryContainer = TertiaryContainer,
                    error = ErrorRed,
                    errorContainer = ErrorContainer,
                    onErrorContainer = OnErrorContainer,
                    background = SurfaceBg,
                    onBackground = OnSurface,
                    surface = SurfaceBg,
                    onSurface = OnSurface,
                    onSurfaceVariant = OnSurfaceVariant,
                    surfaceContainerLowest = SurfaceLowest,
                    surfaceContainerLow = SurfaceLow,
                    surfaceContainer = SurfaceCont,
                    surfaceContainerHigh = SurfaceHigh,
                    outline = Color(0xFF70797A),
                    outlineVariant = Color(0xFFBFC8C9),
                ),
            ) {
                NerApp()
            }
        }
    }
}

@Composable
fun NerApp() {
    var tab by remember { mutableIntStateOf(0) }
    val snackbar = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    Scaffold(
        containerColor = SurfaceBg,
        snackbarHost = { SnackbarHost(snackbar) },
        topBar = { NerTopBar(if (tab == 0) "Corridor Status" else if (tab == 1) "Route Planner" else "Report Disruption") },
        bottomBar = {
            NavigationBar(containerColor = SurfaceLowest) {
                val navItems = listOf(
                    "Home" to Icons.Outlined.Explore,
                    "Route" to Icons.Outlined.AltRoute,
                    "Report" to Icons.Outlined.Landslide,
                )
                navItems.forEachIndexed { index, (label, icon) ->
                    NavigationBarItem(
                        selected = tab == index,
                        onClick = { tab = index },
                        icon = { Icon(icon, contentDescription = label) },
                        label = { Text(label, fontSize = 11.sp) },
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = PrimaryContainer,
                            selectedTextColor = PrimaryContainer,
                            indicatorColor = SurfaceHigh,
                            unselectedIconColor = OnSurfaceVariant,
                            unselectedTextColor = OnSurfaceVariant,
                        ),
                    )
                }
            }
        },
    ) { pad ->
        when (tab) {
            0 -> HomeScreen(Modifier.padding(pad))
            1 -> RouteScreen(Modifier.padding(pad), snackbar, scope)
            else -> ReportScreen(Modifier.padding(pad), snackbar, scope)
        }
    }
}

@Composable
fun NerTopBar(title: String) {
    Surface(color = SurfaceLowest, shadowElevation = 2.dp) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Surface(shape = RoundedCornerShape(10.dp), color = PrimaryContainer) {
                Box(Modifier.size(34.dp).padding(6.dp)) {
                    Box(
                        Modifier.fillMaxSize().background(Primary, RoundedCornerShape(4.dp)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Text("N", color = PrimaryFixedDim, fontWeight = FontWeight.Black, fontSize = 14.sp)
                    }
                }
            }
            Spacer(Modifier.width(10.dp))
            Column {
                Text("NER-Connect", fontSize = 11.sp, letterSpacing = 1.5.sp, color = PrimaryContainer, fontWeight = FontWeight.Bold)
                Text(title, fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = OnSurface)
            }
            Spacer(Modifier.weight(1f))
            TierChip(TIER1.copy(label = "LIVE"), ping = true)
        }
    }
}

@Composable
private fun TierChip(tier: Tier, ping: Boolean = false) {
    Surface(shape = CircleShape, color = tier.bg) {
        Row(
            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier.size(6.dp).background(tier.text, CircleShape)
                    .let { if (ping) it.padding(1.dp) else it },
            )
            Spacer(Modifier.width(5.dp))
            Text(tier.label, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = tier.text, maxLines = 1, softWrap = false)
        }
    }
}

@Composable
fun SectionCard(content: @Composable () -> Unit) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = SurfaceLowest),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
    ) {
        Column(Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) { content() }
    }
}

@Composable
fun SectionTitle(text: String) {
    Text(
        "//  " + text,
        fontSize = 11.sp,
        fontWeight = FontWeight.Bold,
        letterSpacing = 1.2.sp,
        color = OnSurfaceVariant,
    )
}

/* ---------------- SCREEN 1: corridor status ---------------- */

@Composable
fun HomeScreen(modifier: Modifier = Modifier) {
    LazyColumn(
        modifier = modifier.fillMaxSize().background(SurfaceBg),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        item {
            SectionCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        Modifier.size(40.dp).background(SurfaceHigh, RoundedCornerShape(10.dp)),
                        contentAlignment = Alignment.Center,
                    ) {
                        Icon(Icons.Outlined.Terrain, null, tint = PrimaryContainer)
                    }
                    Spacer(Modifier.width(10.dp))
                    Column {
                        Text("Eight States Grid", fontSize = 11.sp, color = InkMuted, letterSpacing = 1.sp)
                        Text("Live Corridor Status", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = OnSurface)
                    }
                    Spacer(Modifier.weight(1f))
                    TierChip(TIER1.copy(label = "MONITORED"))
                }
            }
        }
        item { SectionTitle("ARTERIAL HIGHWAY CORRIDORS") }
        items(CORRIDORS) { c ->
            SectionCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Column(Modifier.weight(1f)) {
                        Text(c.road, fontWeight = FontWeight.Bold, fontSize = 14.sp, color = OnSurface)
                        Text(c.via, fontSize = 12.sp, color = InkMuted)
                    }
                    TierChip(c.tier)
                }
                Spacer(Modifier.height(8.dp))
                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Traffic, null, tint = OnSurfaceVariant, modifier = Modifier.size(15.dp))
                    Spacer(Modifier.width(4.dp))
                    Text(c.note, fontSize = 12.sp, color = OnSurfaceVariant, modifier = Modifier.weight(1f))
                    Text(c.speed, fontSize = 12.sp, fontWeight = FontWeight.Bold, fontFamily = androidx.compose.ui.text.font.FontFamily.Monospace, color = if (c.tier == TIER1) Secondary else TIER3.text)
                }
            }
        }
        item {
            SectionCard {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Check, null, tint = Secondary, modifier = Modifier.size(16.dp))
                    Spacer(Modifier.width(6.dp))
                    Text("Field-verified by Assam Police Logistics", fontSize = 12.sp, color = InkMuted)
                    Spacer(Modifier.weight(1f))
                    Text("10:42 IST", fontSize = 12.sp, fontWeight = FontWeight.Bold, color = InkMuted)
                }
            }
        }
    }
}

/* ---------------- SCREEN 2: route planner ---------------- */

@Composable
fun RouteScreen(modifier: Modifier = Modifier, snackbar: SnackbarHostState, scope: kotlinx.coroutines.CoroutineScope) {
    Column(
        modifier = modifier.fillMaxSize().background(SurfaceBg).verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        SectionCard {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Box(Modifier.size(12.dp).background(PrimaryContainer, CircleShape))
                    Box(Modifier.width(2.dp).height(18.dp).background(OutlineVariant))
                    Icon(Icons.Outlined.LocationOn, null, tint = ErrorRed, modifier = Modifier.size(18.dp))
                }
                Spacer(Modifier.width(12.dp))
                Column {
                    Text("ORIGIN", fontSize = 10.sp, letterSpacing = 1.sp, color = OnSurfaceVariant)
                    Text("Siliguri Junction, WB", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = OnSurface)
                    Spacer(Modifier.height(8.dp))
                    Text("DESTINATION", fontSize = 10.sp, letterSpacing = 1.sp, color = OnSurfaceVariant)
                    Text("Gangtok Central, Sikkim", fontWeight = FontWeight.SemiBold, fontSize = 15.sp, color = OnSurface)
                }
            }
            Spacer(Modifier.height(10.dp))
            Text(
                "1 hr 30 min   ORS VALIDATED",
                fontSize = 20.sp, fontWeight = FontWeight.Black, color = OnSurface,
            )
            Text("114 km via NH-10 · real road network, rerouted around live blockages", fontSize = 13.sp, color = OnSurfaceVariant)
        }

        SectionCard {
            Surface(shape = CircleShape, color = ErrorContainer) {
                Row(Modifier.padding(horizontal = 10.dp, vertical = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                    Box(Modifier.size(8.dp).background(ErrorRed, CircleShape))
                    Spacer(Modifier.width(5.dp))
                    Text("1 SLOW ZONE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ErrorRed)
                }
            }
            Spacer(Modifier.height(10.dp))
            Row(
                Modifier.fillMaxWidth().background(SurfaceLow, RoundedCornerShape(10.dp)).padding(10.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                Box(Modifier.size(36.dp).background(PrimaryContainer, CircleShape), contentAlignment = Alignment.Center) {
                    Icon(Icons.Outlined.Navigation, null, tint = Color.White, modifier = Modifier.size(18.dp))
                }
                Spacer(Modifier.width(10.dp))
                Column {
                    Text("IMD & POLICE ADVISORY", fontSize = 11.sp, fontWeight = FontWeight.Bold, letterSpacing = 1.sp, color = OnSurface)
                    Text("Updated 8m ago", fontSize = 11.sp, color = InkMuted)
                }
            }
            Spacer(Modifier.height(10.dp))
            Text(
                "Teesta River road section near Melli has single-lane crawler traffic due to minor mud clearing. Light vehicles passing smoothly.",
                fontSize = 15.sp, color = OnSurface, lineHeight = 21.sp,
            )
        }

        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("2" to "Pumps Open", "Km 38" to "BRO Post", "94%" to "Cell Cover").forEach { (v, l) ->
                Column(
                    Modifier.weight(1f).background(SurfaceCont, RoundedCornerShape(12.dp)).padding(10.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text(v, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = OnSurface)
                    Text(l, fontSize = 10.sp, color = OnSurfaceVariant)
                }
            }
        }

        Button(
            onClick = { scope.launch { snackbar.showSnackbar("Navigation locked: slope sensors re-check the Melli sector every 4 km.") } },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryContainer, contentColor = Color.White),
            shape = RoundedCornerShape(10.dp),
        ) {
            Icon(Icons.Outlined.Navigation, null, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("START SAFE NAVIGATION", fontWeight = FontWeight.Bold, letterSpacing = 1.sp)
        }
        Spacer(Modifier.height(4.dp))
    }
}

/* ---------------- SCREEN 3: report hazard ---------------- */

@Composable
fun ReportScreen(modifier: Modifier = Modifier, snackbar: SnackbarHostState, scope: kotlinx.coroutines.CoroutineScope) {
    var hazard by remember { mutableIntStateOf(0) }
    var severity by remember { mutableIntStateOf(1) }

    Column(
        modifier = modifier.fillMaxSize().background(SurfaceBg).verticalScroll(rememberScrollState()).padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
    ) {
        SectionCard {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.LocationOn, null, tint = PrimaryContainer, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(6.dp))
                Column {
                    Text("VERIFIED CHAINAGE", fontSize = 10.sp, letterSpacing = 1.sp, color = OnSurfaceVariant)
                    Text("NH-10, Pagla Jhora (Km 42.4) - Pakyong", fontWeight = FontWeight.SemiBold, fontSize = 13.sp, color = OnSurface)
                }
            }
        }

        SectionTitle("DISRUPTION CLASSIFICATION")
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            HAZARDS.chunked(2).forEach { row ->
                Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    row.forEachIndexed { i, h ->
                        val index = HAZARDS.indexOf(h)
                        val selected = hazard == index
                        Box(
                            Modifier
                                .weight(1f)
                                .background(if (selected) PrimaryContainer else SurfaceLowest, RoundedCornerShape(10.dp))
                                .clickable { hazard = index }
                                .padding(12.dp),
                        ) {
                            Column {
                                Row(Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
                                    Icon(hazardIcon(index), null, tint = if (selected) PrimaryFixedDim else Primary, modifier = Modifier.size(22.dp))
                                    Spacer(Modifier.weight(1f))
                                    if (selected) Icon(Icons.Outlined.Check, null, tint = SecondaryContainer, modifier = Modifier.size(16.dp))
                                }
                                Spacer(Modifier.height(6.dp))
                                Text(h.label, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = if (selected) Color.White else OnSurface)
                                Text(h.sub, fontSize = 10.sp, color = if (selected) PrimaryFixedDim else InkMuted)
                            }
                        }
                    }
                    if (row.size == 1) Spacer(Modifier.weight(1f))
                }
            }
        }

        SectionTitle("IMD SEVERITY TIER")
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            SEVERITY.forEachIndexed { i, label ->
                val selected = severity == i
                Box(
                    Modifier
                        .weight(1f)
                        .background(if (selected) PrimaryContainer else SurfaceLowest, RoundedCornerShape(10.dp))
                        .clickable { severity = i }
                        .padding(vertical = 12.dp),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        label,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Bold,
                        color = when {
                            selected -> Color.White
                            i < severity -> Secondary
                            else -> OnSurfaceVariant
                        },
                    )
                }
            }
        }

        Button(
            onClick = {
                scope.launch {
                    snackbar.showSnackbar("Report dispatched to the control room. Segment risk re-scored; nearby transporters alerted.")
                }
            },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = PrimaryContainer, contentColor = Color.White),
            shape = RoundedCornerShape(10.dp),
        ) {
            Icon(Icons.Outlined.Send, null, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("SUBMIT VERIFIED FIELD REPORT", fontWeight = FontWeight.Bold, letterSpacing = 0.5.sp)
        }

        SectionCard {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Outlined.Engineering, null, tint = Primary, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Offline? SMS  NER REPORT <KM> <TYPE> <LEVEL>  to 56161", fontSize = 12.sp, color = OnSurfaceVariant)
            }
        }
        Spacer(Modifier.height(8.dp))
    }
}

private fun hazardIcon(index: Int): ImageVector = when (index) {
    0 -> Icons.Outlined.Landslide
    1 -> Icons.Outlined.Water
    2 -> Icons.Outlined.Traffic
    else -> Icons.Outlined.Engineering
}
